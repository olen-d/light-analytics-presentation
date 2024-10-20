import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from'@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'

import { visuallyHidden } from '@mui/utils'

const TableSort = ({
  headings,
  isFirstColVisible = true,
  rows,
  rowKeys
}) => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState(4)

  const createSortHandler = property => event => {
    handleRequestSort(event, property)
  }

  const descendingComparator = (a, b, orderBy) => {
    if (typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number') {
      if(b[orderBy] < a[orderBy]) {
        return -1
      }
      if (b[orderBy] > a[orderBy]) {
        return 1
      }
      return 0
    } else {
      return a[orderBy].localeCompare(b[orderBy], undefined, { numeric: true })
    }
  }

  const getComparator = (a, b) => {
    return order === 'desc'
      ? descendingComparator(a, b, orderBy)
      : -descendingComparator(a, b, orderBy)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const visibleRows = useMemo(() =>
    [...rows]
      .sort(getComparator),
    [order, orderBy],
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
          {headings.map((element, index) => (
            <TableCell
              key={index}
              align="center"
              sortDirection={orderBy === index ? order : false}
            >
              <TableSortLabel
                active={orderBy === index}
                direction={orderBy === index ? order : 'asc'}
                onClick={createSortHandler(index)}
              >
                {element}
                {orderBy === index ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((element, index) => (
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

const { array, bool } = PropTypes

TableSort.propTypes = {
  headings: array,
  isFirstColVisible: bool,
  rows: array,
  rowKeys: array
}

export default TableSort
