#!/bin/bash
echo Generating new baby contract

geth --exec 'loadScript("NewBabyContract.js")' attach http://54.165.162.108:8545

