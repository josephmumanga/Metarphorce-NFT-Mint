const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const ssm = new AWS.SSM();

  try {
    // Execute the commands on the EC2 instance using Systems Manager Run Command
    await ssm.sendCommand({
      DocumentName: 'AWS-RunShellScript',
      InstanceIds: ['i-0313b6faa5395b5d8'], // Replace with your EC2 instance ID
      Parameters: {
        commands: [
          'nvm use --lts',
          'truffle migrate --reset --network mumbai',
          'truffle exec scripts/mintNFT.js --network mumbai'
        ]
      }
    }).promise();

    return {
      statusCode: 200,
      body: 'Commands executed successfully'
    };
  } catch (error) {
    console.error('Error executing commands:', error);
    throw error;
  }
};
