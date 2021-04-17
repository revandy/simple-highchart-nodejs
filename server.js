const express    = require('express');
const app        = express();
const readXlsxFile = require('read-excel-file/node');
app.listen(4000, () => console.log('Server berjalan di port 4000'));
app.use(express.static('public'));
const schema = {
  'month_id': {
    prop: 'date',
    type: Date
  },
  'target': {
    prop: 'target',
    type: Number,
  },
  'achievement': {
    prop: 'achievement',
    type: Number,
  },
  'category': {
    prop: 'category',
    type: String,
    oneOf: [
      'Transmission Expenses',
      'Power Expenses',
      'Radio Frequency Usage'
    ]
  }
}
app.get('/data', async (req, res) => {
  var path = "public/assets/example_data.xlsx"
  readXlsxFile(path, { schema }).then(({ rows, errors }) => {
    res.json(rows)
  })
})