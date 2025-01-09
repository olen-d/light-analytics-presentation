import { PropTypes } from 'prop-types'

const TitleTable = ({ title }) => {
  return (
    <div className="table-text-title">
      {title}
    </div>
  )
}

const { string } = PropTypes

TitleTable.propTypes = {
  title: string,
}

export default TitleTable
