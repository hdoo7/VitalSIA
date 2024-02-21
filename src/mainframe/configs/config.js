export default [
  {
    "name": "ChromeSpeech",
    "uri": "/sensors/ChromeSpeech",
    "active": false
  },
  {
    "name": "UserCommandInterpreter",
    "uri": "/processors/UserCommandInterpreter",
    "active": false
  },
  {
    "name": "WebRTCVideo",
    "uri": "/sensors/WebRTCVideo",
    "active": true
  },
  {
    "name": "VideoStreamDisplay",
    "uri": "/effectors/VideoStreamDisplay",
    "active": true
  },
  {
    "name": "VisFACSSchererFearFields",
    "uri": "/processors/VisFACSSchererFearFields",
    "active": true
  },
  {
    "name": "Intervention_DCU",
    "uri": "/processors/InterventionEngine",
    "params": [
      {
        "name": "interventionClass",
        "value": "HSR"
      }
    ],
    "active": false
  }
]