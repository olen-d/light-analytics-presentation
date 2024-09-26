import PropTypes from 'prop-types'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from'@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const TableBasic = ({
  headings,
  rows,
  rowKeys
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
          {headings.map((element, index) => (
            <TableCell key={index} align="center">{element}</TableCell>
          ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((element, index) => (
            <TableRow
              key={rowKeys[index]}
            >
              {element.map((cell, index) => (
                index === 0 ? <TableCell key={`tbc${index}`} component="th" scope="row">{cell}</TableCell> : <TableCell key={`tbc${index}`} align="right">{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
  
}

const { array } = PropTypes

TableBasic.propTypes = {
  headings: array,
  rows: array,
  rowKeys: array
}

export default TableBasic
