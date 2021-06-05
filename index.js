const manifest = require("./manifest.json")
const fs = require("fs")

const { GenerateActionCreators, GenerateReducers, GenerateMiddleware, GenerateModel } = require("./helpers")

const { service_name, actions } = manifest
const arguments = process.argv ;
const root_path = arguments[2]
global.__dirname = root_path
// create service folder
fs.mkdirSync(`${root_path}/` + manifest.service_name + "/actions", {
  recursive: true,
})

fs.mkdirSync(`${root_path}/` + manifest.service_name + "/model", {
  recursive: true,
})

fs.mkdirSync(`${root_path}/` + manifest.service_name + "/reducers", {
  recursive: true,
})

fs.mkdirSync(`${root_path}/` + manifest.service_name + "/middleware", {
  recursive: true,
})


GenerateActionCreators({ actions, service_name, root_path })

GenerateModel({ actions, service_name, root_path })

GenerateReducers({actions, service_name, root_path})

GenerateMiddleware({actions, service_name, root_path})
