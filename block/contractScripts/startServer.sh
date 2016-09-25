#!/bin/bash

echo Starting Geth Server...

killall -HUP geth
geth --dev --rpc --rpcaddr "0.0.0.0" --rpcapi "eth,net,web3,personal" --unlock 0 --password "serverpass" --mine console



