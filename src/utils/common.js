import { TableCell, Button } from '@mui/material';
import moment from 'moment';

// Print Table Cell
export const printRow = (column, obj, showMore) => {
  let rowData = '';
  if (column === 'value') {
    rowData = '$' + obj[column]
  }
  else if (column === 'from_date' || column === 'to_date') {
    rowData = moment(obj[column]).format('MM/DD hh:mm a');
  }
  else if (column === 'distributor') {
    rowData = <Button onClick={() => showMore(obj)} size='small'> {obj[column]} </Button>
  }
  else rowData = obj[column];

  return <TableCell key={column}> { rowData } </TableCell>;
}

// Generate CSV report of all donations by the current donor and download file to machine.
export const generateReport = (columns, rows) => {
  // Convert array of objects to CSV
  const fileData = [
    columns.join(','),
    ...rows.map(obj => columns.reduce((acc, key) =>
      `${acc}${!acc.length ? '' : ','}"${(obj[key] === null) ? '' : String(obj[key])}"`, ''
    ))
  ].join('\n');

  // Create Blob
  const blob = new Blob([fileData], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  // window.open(url) // to open in new tab
  
  // Download CSV
  const link = document.createElement("a")
  link.download = `careshare_donations_${moment(new Date()).format("YY-MM-DD")}.csv`
  link.href = url
  link.click()
  link.remove()
}