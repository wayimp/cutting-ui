const tsheetJson = require('./tsheet.json')

const parseTSheet = async tsheet => {
  const sheets = await Object.entries(tsheet.results.timesheets).map(
    async ([key, value]) => {
      if (value.id) {
        const sheet = { id: value.id }
        sheet.date = new Date(value.date)
        sheet.start = new Date(value.start)
        sheet.end = new Date(value.end)
        sheet.duration = Number(value.duration)

        if (value.user_id) {
          if (tsheet.supplemental_data && tsheet.supplemental_data.users) {
            const user = tsheet.supplemental_data.users[value.user_id]
            if (user) {
              sheet.name = user.first_name + ' ' + user.last_name
            }
          }
        }

        if (value.customfields) {
          Object.entries(value.customfields).map(([key, value]) => {
            if (value) {
              if (
                tsheet.supplemental_data &&
                tsheet.supplemental_data.customfields
              ) {
                const customfieldInfo =
                  tsheet.supplemental_data.customfields[key]
                if (customfieldInfo) {
                  if (sheet.notes) {
                    sheet.notes += ','
                  } else {
                    sheet.notes = ''
                  }
                  sheet.notes += customfieldInfo.name + ':' + value
                }
              }
            }
          })
        }

        console.log(sheet)
      }
    }
  )
}

parseTSheet(tsheetJson)
