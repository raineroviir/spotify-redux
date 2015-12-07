require('babel/register');
if(process.env.NODE_ENV !== 'production') {
  require('./developmentServer');
} else {
  require('../productionServer');
}
