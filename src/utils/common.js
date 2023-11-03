import moment from 'moment';

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