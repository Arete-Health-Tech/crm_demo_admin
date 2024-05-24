import { Pagination } from '@mui/material';
import '../../screen/ticket/singleTicket.css';

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
        color="primary"
        size="small"
        page={page}
        onChange={handlePagination}
        count={pageCount}
        sx={{
          fontSize: "12px",
          padding: '10px 0 10px 25px',
          '& .MuiPaginationItem-root': {
            fontFamily: 'Outfit, sans-serif',
            '&.Mui-selected': {
              backgroundColor: '#0566FF',
              color: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
};

export default CustomPagination;