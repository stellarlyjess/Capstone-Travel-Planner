module.exports = {
    "setupFilesAfterEnv": [
        "./__test__/setupTests.js"
    ],
    "transform": {
        "^.+\\.js$": "babel-jest",
        "^.+\\.html?$": "html-loader-jest"
    }
}
