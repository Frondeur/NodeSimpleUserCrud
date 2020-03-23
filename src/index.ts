import app from './App';
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT || 3000;

app.listen(port, (err: any) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});
