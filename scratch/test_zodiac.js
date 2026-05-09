import { zodiacService } from './services/zodiacService';

async function test() {
  try {
    const data = await zodiacService.getAllZodiacs();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
