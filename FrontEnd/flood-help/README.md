# Front End  

## Desing Documents

Hi-Fidelity Prototype: 
- **Figma Link:** https://www.figma.com/design/L2T1b2bqz5sFVOV0v0tAuG/Prototype?node-id=0-1&t=YrOXl0Z4KgqZF7qr-1
- **View-Access password:** amber-cloudy-foam-detach
- **PowerPoint Link : https://www.canva.com/design/DAGOlT_KycE/ikoF0-7dEFMcLY00ujxmTg/edit

## Setup

### updating API endpoint (optional)
If you are running our api server yourself (see /Backend/ReadMe.md for details on how to setup) and want the app to use it (this will be required once we stop the aws instance that is running the public api server next year) you will need to change some configs in the code. 
#### update endpoint in code
open FrontEnd/flood-help/hooks/useAPI.js and change 'http://54.206.190.121:5000 on line 5 to the address of your running API server. 

### Building and running the App
