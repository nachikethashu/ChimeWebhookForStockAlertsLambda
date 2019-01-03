echo "deploying StockAlerts lambda"

echo "npm installing.."
npm install
if [ $? -eq 0 ]; then
  echo "done";
else
  echo "npm install failed";
  exit 1;
fi

echo "Checking that aws-cli is installed"
which aws
if [ $? -eq 0 ]; then
  echo "aws-cli is installed, continuing..."
else
  echo "You need aws-cli to deploy this lambda. Google 'aws-cli install'"
  exit 1
fi

echo "removing old zip"
rm index.zip;

echo "creating a new zip file"
zip -j index.zip ./dist/index.js  # Note the -j setting. This strips the path from the file inside the zip. https://stackoverflow.com/a/47889958/1657018

echo "uploading zip file.."

aws lambda update-function-code --function-name StockAlerts --zip-file fileb:///Users/upadhyan/workspace/stock-alerts/index.zip --publish

if [ $? -eq 0 ]; then
  echo "!! Upload successful !!"
else
  echo "Upload failed"
  echo "If the error was a 400, check that there are no slashes in your lambda name"
  exit 1;
fi
