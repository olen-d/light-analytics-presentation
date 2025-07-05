import { useState } from 'react'

import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from'@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

const TableBasic = ({
  headings,
  maxRowsDisplayed = 10,
  rows,
  rowKeys
}) => {

  const [maxRowsToDisplay, setMaxRowsToDisplay] = useState(maxRowsDisplayed)
  const [rowsDisplayed, setRowsDisplayed] = useState(rows.slice(0, maxRowsToDisplay))
  const [shouldShowMore, setShouldShowMore] = useState(true)

  const totalRows = rows.length

  const maxRowsExceeded = totalRows > maxRowsDisplayed ? true : false

  const toggleShouldShowMore = () => {
    if (shouldShowMore) {
      setRowsDisplayed(rows)
    } else {
      const rowsToDisplay = rows.slice(0, maxRowsDisplayed)
      setRowsDisplayed(rowsToDisplay)
    }
    setShouldShowMore(!shouldShowMore)
  }

  return (
    <div className="table-container">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            {headings.map((element, index) => (
              <TableCell key={index} align="center">{element}</TableCell>
            ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsDisplayed.map(([id, ...rest]) => (
              <TableRow
                key={id}
              >
                {rest.map((cell, index) => (
                  index === 0 ? <TableCell key={`tbc${index}`} component="th" scope="row">{cell}</TableCell> : <TableCell key={`tbc${index}`} align="right">{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {maxRowsExceeded ? (
            <TableFooter>
              <tr>
                <td colSpan={2} className="table-footer-button">
                  <Button onClick={toggleShouldShowMore} variant="text">show {shouldShowMore ? 'more' : 'less'}</Button>
                </td>
              </tr>
            </TableFooter>
            ) : (
              null
            )}
        </Table>
      </TableContainer>
    </div>
  )
}

const { array, number } = PropTypes

TableBasic.propTypes = {
  headings: array,
  maxRowsDisplayed: number,
  rows: array,
  rowKeys: array
}

export default TableBasic
