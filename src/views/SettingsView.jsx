'use strict'

import FormExcludeQueryParameters from '../components/FormExcludeQueryParameters'

const SettingsView = () => {
  return(
    <div className='settingsView'>
      <h1 className="admin-lead extended">Administration &raquo; Settings</h1>
      <div className='form-exclude-query-parameters-container'>
        <FormExcludeQueryParameters />
      </div>
    </div>
  )
}

export default SettingsView
