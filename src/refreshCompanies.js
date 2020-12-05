const axios = require('axios')

const axiosApiClient = axios.create({
  baseURL: 'http://localhost:4040'
  //baseURL: 'https://api.valleycuttingsystems.net'
})

const parseJobCodesPage = async jobCodes => {
  const names = await Object.entries(jobCodes.results.jobcodes).map(
    async ([key, value]) => {
      if (value.name) {
        const company = { name: value.name }
        if (value.locations && value.locations.length > 0) {
          const locationCode = value.locations[0]
          const locationInfo =
            jobCodes.supplemental_data.locations[locationCode]
          if (locationInfo) {
            company.addr1 = locationInfo.addr1
            company.addr2 = locationInfo.addr2
            company.city = locationInfo.city
            company.state = locationInfo.state
            company.zip = locationInfo.zip
            company.formatted_address = locationInfo.formatted_address
            company.country = locationInfo.country
            company.active = locationInfo.active
            company.latitude = locationInfo.latitude
            company.longitude = locationInfo.longitude
            company.label = locationInfo.label
          }
        }

        await axiosApiClient({
          method: 'post',
          url: '/companies',
          data: company
        })
          .then(response => {
            // console.log('Company inserted: ' + company.name)
          })
          .catch(error => {
            console.log('Error inserting into database: ' + error)
          })
      }
    }
  )
}

const getApiToken = async () => {
  // Authenticate to the database first
  const params = { username: 'ed', password: 'iran' }
  await axiosApiClient.post('/token', params).then(res => {
    const token = res.data.access_token
    axiosApiClient.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    if (token) {
      // console.log('API token received: ' + token.substring(0, 40) + '...')
    } else {
      // console.log('Error authenticating to API')
    }
  })
}

const deleteCompanies = async () => {
  await axiosApiClient({
    method: 'delete',
    url: '/companies',
    body: {}
  })
    .then(response => {
      // console.log('All companies deleted')
    })
    .catch(error => {
      console.log('Error deleting companies: ' + error)
    })
}

const getJobCodesPage = async pageNo => {
  const url = 'https://rest.tsheets.com/api/v1/jobcodes'

  await axios
    .get(url, {
      params: { page: pageNo },
      headers: {
        Authorization: 'Bearer S.5__8e128a072a0b7cebf73f4a5759297c039b50f6c4',
        'Cache-Control': 'no-cache'
      }
    })
    .then(async response => {
      // console.log('Job Codes Received')
      await parseJobCodesPage(response.data)
    })
    .catch(error => {
      console.log('Error retrieving job codes: ' + error)
    })
}

const refreshCompanies = async () => {
  await getApiToken()
  await deleteCompanies()
  await getJobCodesPage(1)
  await getJobCodesPage(2)
  await getJobCodesPage(3)
  await getJobCodesPage(4)
}

refreshCompanies()