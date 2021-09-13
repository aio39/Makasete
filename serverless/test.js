const { memoryUsage } = require('process');

console.log(memoryUsage());
const name = () => {
  const vision = require('@google-cloud/vision');
  const Busboy = require('busboy');
  const axios = require('axios');
  const { memoryUsage } = require('process');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  console.log(memoryUsage());
};

name();
