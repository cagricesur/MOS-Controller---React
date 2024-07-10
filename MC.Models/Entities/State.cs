using MC.Models.Attributes;
using System.ComponentModel.DataAnnotations;

namespace MC.Models.Entities
{
    [TsClass]
    public class State
    {
        public Guid ID { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(50)]
        public required string Caption { get; set; }

        public string? Description { get; set; }

        [Required]
        public required List<StateRow> Rows { get; set; } = [];

        [Required]
        public required List<StateColumn> Columns { get; set; } = [];

        public DateTime CreationDate { get; set; }
    }
    [TsClass]
    public class StateRow
    {
        public Guid ID { get; set; }

        [Required]
        public required int CodeStart { get; set; }

        [Required]
        public required int CodeEnd { get; set; }
    }
    [TsClass]
    public class StateColumn
    {
        public Guid ID { get; set; }

        [Required]
        public required int Position { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public required string Caption { get; set; }

        [MinLength(7)]
        [MaxLength(7)]
        public string? Color { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(10)]
        public required string Code { get; set; }
    }
}
