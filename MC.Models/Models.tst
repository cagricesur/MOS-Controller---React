${
    // Enable extension methods by adding using Typewriter.Extensions.*
    using Typewriter.Extensions.Types;

    // Uncomment the constructor to change template settings.
    Template(Settings settings)
    {
        settings.IncludeCurrentProject();
        settings.OutputDirectory="../MC.Web/MC.Web.Client/src/models";
        settings.SingleFileMode("server.ts");
    }

    // Custom extension methods can be used in the template by adding a $ prefix e.g. $LoudName
    string InterfaceDefinition(Class c)
    {
        var name = c.ToString();
        if(c.BaseClass != null){
            name = string.Format("{0} extends {1}", name, c.BaseClass.ToString());
        }
        return name;
    }

    string PropertyDefinition(Property property)
    {
        var name = property.name;
        if(property.Type.IsNullable){
            name+="?";
        }
        var type = property.Type.ToString().Split('|').First().Trim();
        return string.Format("{0}:{1}",name, type);
    }
}


    // $Classes/Enums/Interfaces(filter)[template][separator]
    // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
    // template: The template to repeat for each matched item
    // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]

    // More info: http://frhagn.github.io/Typewriter/


    $Enums([TsEnum])[
    export enum $Name { 
        $Values[
        $Name,]
    }]

    $Classes([TsClass])[
    export interface $InterfaceDefinition {
        $Properties[
        $PropertyDefinition;]
    }]


