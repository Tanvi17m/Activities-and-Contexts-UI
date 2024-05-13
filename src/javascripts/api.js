async function generateAccessToken() {
   const client_id = import.meta.env.VITE_CLIENT_ID
   const client_secret = import.meta.env.VITE_CLIENT_SECRET

  const url = `https://bd-test.andrew.cmu.edu:81/oauth/access_token/client_id=${client_id}/client_secret=${client_secret}`

  const headers = {
    Accept: 'application/json'
  }
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`Error obtaining access token: ${response.statusText}`)
    }
    const data = await response.json()
    //   console.log("HERe is my data", data);
    return data.access_token
  } catch (error) {
    console.error('There was an error:', error.message)
  }
}

async function addBuildingTags(accessToken, templateData, tagName) {
  const building = 'WeanHall'
  const url = `https://bd-test.andrew.cmu.edu:81/api/building/${building}/tags`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  // console.log(templateData[tagName])
  const addBuildingTagsData = {
    data : {
        name: tagName,
        value: JSON.stringify(templateData[tagName])
    }
  }
 
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(addBuildingTagsData)
    })

    if (response.status === 200) {
      return await response.json()
    } else {
      console.log(response)  
      throw new Error(`Error creating building tags: ${error.message}`)
    }
  } catch (error) {
    throw new Error(`Error creating building tags: ${error.message}`)
  }
}

async function addSensor(accessToken, templateData) {
  const url = 'https://bd-test.andrew.cmu.edu:81/api/sensor'
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const sensor_name = 'context_app_template'
  const sensor_id = `template_session_${templateData.templateName}_${templateData.sensorName}`

  const addSensorData = {
    data: {
      name: sensor_name,
      identifier: sensor_id,
      building: 'WeanHall'
    }
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(addSensorData)
    })

    if (!response.ok) {
      throw new Error('Error creating sensor')
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Error creating sensor: ${error.message}`)
  }
}

async function addSensorTags(accessToken, templateData, uuid) {
  const sensor = uuid
  const url = `https://bd-test.andrew.cmu.edu:81/api/sensor/${sensor}/tags`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
  //console.log(JSON.stringify(templateData[tagName]))
   const addSensorTagsData = {
     data: {
       tags: [
         {
           name: 'contextDataWithActivities',
           value: JSON.stringify(templateData['contextDataWithActivities'])
         },
         {
           name: 'sensorTypes',
           value: JSON.stringify(templateData['sensorTypes'])
         }
       ]
     }
   }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(addSensorTagsData)
    })

    if (!response.ok) {
      throw new Error(`Error creating sensor tags: Status code ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Error creating sensor tags: ${error.message}`)
  }
}

async function searchSensor(accessToken, searchSensorData) {
  const url = 'https://bd-test.andrew.cmu.edu:81/api/sensor/search'
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const data = searchSensorData

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })

    console.log(response.status)

    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(`Error searching sensor: Status ${response.status}`)
    }
  } catch (error) {
    console.error(`Error searching sensor: ${error.message}`)
    throw error
  }
}

async function postData(templateData){
    const access_token = await generateAccessToken()

    let response = await addBuildingTags(access_token, templateData, 'sensorTypes')
    console.log(response)

    response = await addBuildingTags(access_token, templateData, 'contextDataWithActivities')
    console.log(response)

    const sensor_response = await addSensor(access_token, templateData)
    console.log(sensor_response)

    const tagsResponse1 = await addSensorTags(access_token, templateData,sensor_response.uuid)
    console.log(tagsResponse1)

    // const tagsResponse2 = await addSensorTags(access_token, templateData,'e6d024d2-1989-47ad-8fac-ff13c763028f', 'contextDataWithActivities')
    // console.log(tagsResponse2)
}

async function searchTemplateSensors(){
    const access_token = await generateAccessToken()
    const searchSensorData = {
        data: {
          SourceName: ['context_app_template'],
          Owner: ['tmahatme@andrew.cmu.edu']
        }
    }
    let response = await searchSensor(access_token, searchSensorData)
    console.log(response)
    response = transformApiResponseToArray(response.result)
    //console.log(response)
    return response
}

async function updateTemplateDetails(templateData) {
  const access_token = await generateAccessToken()
  
//   const sensorTypesSearchString = JSON.stringify(templateData['sensorTypes'])
//   const contextSearchString = JSON.stringify(templateData['contextDataWithActivities'])

//   console.log(sensorTypesSearchString)
//   console.log(contextSearchString)
  const sensor_id = `template_session_${templateData.templateName}_${templateData.sensorName}`

  const searchSensorData = {
    data: {
      //    Tags: ['sensorTypes : sensorTypesSearchString', 'contextDataWithActivities: contextSearchString']
      SourceIdentifier: [sensor_id]
    }
  }
    let response = await addBuildingTags(access_token, templateData, 'sensorTypes')
    console.log(response)

    response = await addBuildingTags(access_token, templateData, 'contextDataWithActivities')
    console.log(response)

 response = await searchSensor(access_token, searchSensorData)
  console.log(response)

  const tagsResponse1 = await addSensorTags(access_token, templateData, response.result[0].name)
  console.log(tagsResponse1)
}

function transformApiResponseToArray(response) {
  // Check if the input is a valid array
  if (!Array.isArray(response)) {
    throw new Error('Expected an array as input')
  }

  // Transform each item in the array
  return response.map((item) => {
    // Parse the source_identifier
    const match = item.source_identifier.match(/template_session_(.+)_(.+)/)
    if (!match) {
      throw new Error('source_identifier format is incorrect')
    }
    const templateName = match[1]
    const sensorName = match[2]

    // Prepare the object structure
    const templateData = {
      sensorName: sensorName,
      templateName: templateName,
      sensorTypes: [],
      activitiesData: [],
      contextsData: [],
      contextDataWithActivities: {}
    }

    // Process tags to extract specific information
    item.tags.forEach((tag) => {
      if (tag.name === 'sensorTypes') {
        templateData.sensorTypes = JSON.parse(tag.value)
      } else if (tag.name === 'contextDataWithActivities') {
        templateData.contextDataWithActivities = JSON.parse(tag.value)
      }
    })

    return templateData
  })
}

export { postData, searchTemplateSensors, updateTemplateDetails }