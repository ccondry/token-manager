#!/bin/sh
echo "running yarn"
yarn
if [ $? -eq 0 ]; then
  echo "edit .env file first"
  vim .env
  echo "installing systemd service..."
  sudo cp systemd.service /lib/systemd/system/token-manager.service
  sudo systemctl enable token-manager.service
  echo "starting systemd service..."
  sudo sudo /bin/systemctl start token-manager.service
else
  echo "yarn failed"
fi
