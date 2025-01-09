import { PropTypes } from 'prop-types'

const SubtitleTable = ({ subtitle }) => {
  return (
    <div className="table-text-subtitle">
      {subtitle}
    </div>
  )
}

const { string } = PropTypes

SubtitleTable.propTypes = {
  subtitle: string,
}

export default SubtitleTable
