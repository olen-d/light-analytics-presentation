import { PropTypes } from 'prop-types'

const SourceTable = ({ source }) => {
  return (
    <div className="table-text-source">
      <span className="table-text-source-label">Source:</span> {source}
    </div>
  )
}

const { string } = PropTypes

SourceTable.propTypes = {
  source: string,
}

export default SourceTable
