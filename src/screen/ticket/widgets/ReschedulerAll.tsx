import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react'

function ReschedulerAll({ data }) {
  // console.log(data," this is data from call rescfdhfjhgjfgfgkkk")
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reason</TableCell>
            <TableCell>Comments</TableCell>
            <TableCell>Date</TableCell>

            {/* Add more headers as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {item?.selectedLabels ? (
                  item.selectedLabels.map((selectedLabel, labelIndex) => (
                    <React.Fragment key={labelIndex}>
                      <span>{selectedLabel.label}</span>
                      {labelIndex < item.selectedLabels.length - 1 && (
                        <br />
                      )}{' '}
                      {/* Add a line break if not the last label */}
                    </React.Fragment>
                  ))
                ) : (
                  <span>Empty</span>
                )}
              </TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                {dayjs(item.date).format('DD/MMM/YYYY hh:mm A')}
              </TableCell>
              {/* Add more cells as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReschedulerAll