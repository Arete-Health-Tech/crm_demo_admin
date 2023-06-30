import { Pagination } from '@mui/material';

interface iPageProp {
  handlePagination: (event: React.ChangeEvent<unknown>, page: number) => void;
  pageCount: number;
  page: number;
}

const CustomPagination = (props: iPageProp) => {
  const { handlePagination, pageCount, page } = props;
  return (
    <div>
      <Pagination
        size="small"
        page={page}
        onChange={handlePagination}
        count={pageCount}
      />
    </div>
  );
};

export default CustomPagination;
