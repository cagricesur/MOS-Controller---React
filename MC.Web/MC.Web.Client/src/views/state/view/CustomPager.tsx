import { Button, Flex, Select } from "antd";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export interface CustomPage {
  label: string;
  value: string;
}

interface CustomPagerProps {
  page: CustomPage;
  pages: CustomPage[];
  onPageSet: (page: CustomPage) => void;
}

export const CustomPager: React.FunctionComponent<CustomPagerProps> = (
  props
) => {
  const [page, setPage] = useState<CustomPage>(props.page);
  const getCurrentIndex = (): number => {
    return props.pages.findIndex((p) => p.value === page.value);
  };
  return (
    <>
      {props.pages.length > 1 && (
        <Flex
          vertical={false}
          style={{ flex: "auto", marginBottom: "1rem" }}
          justify="center"
          align="center"
          gap={16}
        >
          <Button
            disabled={getCurrentIndex() <= 0}
            shape="circle"
            icon={<FaAngleLeft />}
            onClick={() => {
              const index = getCurrentIndex();
              const next = props.pages[index - 1];
              props.onPageSet(next);
              setPage(next);
            }}
          ></Button>
          <Select
            labelInValue
            value={page}
            options={props.pages}
            onChange={(value) => {
              props.onPageSet(value);
              setPage(value);
            }}
          ></Select>
          <Button
            disabled={getCurrentIndex() === props.pages.length - 1}
            shape="circle"
            icon={<FaAngleRight />}
            onClick={() => {
              const index = getCurrentIndex();
              const next = props.pages[index + 1];
              props.onPageSet(next);
              setPage(next);
            }}
          ></Button>
        </Flex>
      )}
    </>
  );
};
