// const prettier = require("prettier")
const fs = require("fs")

// const PRETTIER_CONFIG = {
//   tabWidth: 2,
//   trailingComma: "none"
// }

// function formatCodeWithPrettier(data) {
//   const config = { ...PRETTIER_CONFIG }

//   return prettier.format(data, config)
// }

function GenerateActionCreators({ actions, service_name, root_path }) {
  const TEMPLATE_PATH = "./service_template/actions/actionCreators.dart"
  fs.readFile(TEMPLATE_PATH, "utf8", (err, data) => {
    if (err) throw err
    let code = "",
      clonedData = data
    actions.forEach((action) => {
      clonedData = clonedData.replace(/ACTION_CREATOR_REQ/g, action + "Req")
      clonedData = clonedData.replace(
        /ACTION_CREATOR_SUCCESS/g,
        action + "Success"
      )
      clonedData = clonedData.replace(
        /ACTION_CREATOR_FAILURE/g,
        action + "Failure"
      )
      code = code + clonedData + "\n\n"
      clonedData = data
    })

    const formattedCode = code
    fs.writeFile(
      `${root_path}/${service_name}/actions/actionCreators.dart`,
      `${formattedCode}`,
      function (err) {
        if (err) throw err
        console.log("Action creators created successfully.")
      }
    )
  })
}

function GenerateModel({ actions, service_name, root_path }) {
  const initialState = actions.reduce((init, action) => {
    return {
      ...init,
      [action]: {
        isLoading: true,
        data: [],
        error: ""
      }
    }
  }, {})

  const formattedCode = `
  class AppState {
    Map<String, dynamic> initialState;
  
    AppState.initialState()
    : initialState = ${JSON.stringify(initialState)};

    AppState({this.initialState});
    AppState.fromAppState(AppState another) {
      initialState = another.initialState;
    }
  }`
  fs.writeFile(
    `${root_path}/${service_name}/model/app_state.dart`,
    `${formattedCode}`,
    function (err) {
      if (err) throw err
      console.log("Reducer created successfully.")
    }
  )
}

function GenerateReducers({ actions, service_name, root_path }) {
  const TEMPLATE_PATH = "./service_template/reducers/index.txt"
  fs.readFile(TEMPLATE_PATH, "utf8", (err, data) => {
    if (err) throw err
    const initialState = actions.reduce((init, action) => {
      return {
        ...init,
        [action]: {
          isLoading: true,
          data: [],
          error: ""
        }
      }
    }, {})
    let code = `import '../actions/actionCreators.dart';\nimport '../model/app_state.dart';\n\n
    AppState appReducer(AppState prevState, dynamic action){
      AppState newState = AppState.fromAppState(prevState);\n
    `,
      clonedData = data
    actions.forEach((action) => {
      clonedData = clonedData.replace(/ACTION_TYPE_REQ/g, action + "Req")
      clonedData = clonedData.replace(
        /ACTION_TYPE_SUCCESS/g,
        action + "Success"
      )
      clonedData = clonedData.replace(
        /ACTION_TYPE_FAILURE/g,
        action + "Failure"
      )

      clonedData = clonedData.replace(/ACTION_TYPE/g, action)

      code = code + clonedData + "\n\n" + "\n else "
      clonedData = data
    })
    code =
      code +
      `\n
      return newState;  
      \nreturn newState;  
  }
  `
    const formattedCode = code
    fs.writeFile(
      `${root_path}/${service_name}/reducers/app_reducer.dart`,
      `${formattedCode}`,
      function (err) {
        if (err) throw err
        console.log("Reducer created successfully.")
      }
    )
  })
}

function GenerateMiddleware({ actions, service_name, root_path }) {
  const TEMPLATE_PATH = "./service_template/middleware/index.txt"
  fs.readFile(TEMPLATE_PATH, "utf8", (err, data) => {
    if (err) throw err
    const actionCreators = actions.reduce((init, action) => {
      return [...init, action + "Req", action + "Success", action + "Failure"]
    }, [])
    let code = `
    import 'dart:convert';
    import '../actions/actionCreators.dart';
    import '../model/app_state.dart';
    import 'package:redux_thunk/redux_thunk.dart';
    import 'package:redux/redux.dart';
    import 'package:http/http.dart' as http;
    \n
    `,
      clonedData = data

    actions.forEach((action) => {
      clonedData = clonedData.replace(
        /ACTION_TYPE/g,
        action[0].toLowerCase() + action.slice(1)
      )

      clonedData = clonedData.replace(/ACTION_CREATOR_REQ/g, action + "Req")
      clonedData = clonedData.replace(
        /ACTION_CREATOR_SUCCESS/g,
        action + "Success"
      )
      clonedData = clonedData.replace(
        /ACTION_CREATOR_FAILURE/g,
        action + "Failure"
      )

      clonedData = clonedData.replace(/ACTION_TYPE/g, action.toLowerCase())

      code = code + clonedData + "\n\n"
      clonedData = data
    })

    const formattedCode = code
    fs.writeFile(
      `${root_path}/${service_name}/middleware/app_middleware.dart`,
      `${formattedCode}`,
      function (err) {
        if (err) throw err
        console.log("Middleware created successfully.")
      }
    )
  })
}

function GenerateWidgets({ widgets, service_name, root_path }) {
  const TEMPLATE_PATH = "./service_template/widget.txt"
  fs.readFile(TEMPLATE_PATH, "utf8", (err, data) => {
    if (err) throw err

    widgets.forEach((widget) => {
      let code = ``,
        clonedData = data
      clonedData = clonedData.replace(
        /WIDGET_NAME/g,
        widget[0].toUpperCase() + widget.slice(1)
      )
      code = code + clonedData + "\n\n"
      clonedData = data
      const formattedCode = code
      fs.writeFile(
        `${root_path}/${service_name}/widgets/${
          widget[0].toUpperCase() + widget.slice(1)
        }.dart`,
        `${formattedCode}`,
        function (err) {
          if (err) throw err
          console.log(`${widget} widget created successfully.`)
        }
      )
    })
  })
}

module.exports = {
  GenerateActionCreators,
  GenerateModel,
  GenerateReducers,
  GenerateMiddleware,
  GenerateWidgets
}
