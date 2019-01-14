'use strict';

//list of bars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function RealPricePerPersons(persons, pricePerPerson)
{
  if(persons > 60) return pricePerPerson -= pricePerPerson * 0.5;
  else if(persons > 20) return pricePerPerson -= pricePerPerson * 0.3;
       else if(persons > 10) return pricePerPerson -= pricePerPerson * 0.1;
            else return pricePerPerson;
}

function BookerPrice(bookerId)
{
  for(var i = 0; i < events.length; i++)
  {
    if(bookerId == events[i].id)
    {
      for(var j = 0; j < bars.length; j++)
      {
        if(events[i].barId == bars[j].id) return (events[i].time * bars[j].pricePerHour) + RealPricePerPersons(events[i].persons, bars[j].pricePerPerson);
      }
    }
  }
}

function Commission(bookingPrice, event)
{
  const commission = []; //[0] : insurance    [1] : treasury    [3] : privateaser
  commission[0] = (bookingPrice * 0.3) / 2;
  commission[1] = event.persons;
  if(event.deductibleReduction) commission[3] = commission[0];
  else commission[3] = commission[0] - commission[1];
  if(commission[3] < 0) commission[3] = 0;
  return commission;
}

function GenerateBookerPrices()
{
  const commissions = [];
  const bookingPrices = [];
  for(var i = 0; i < events.length; i++)
  {
    var price = BookerPrice(events[i].id);
    var commission = Commission(price, events[i]);
    commissions.push(commission);
    if(events[i].deductibleReduction) price += events[i].persons;
    bookingPrices.push(price);
  }
}

function CalculateCommission(commision)
{
  var result = 0;
  for(var i = 0; i < commision.length; i++)
  {
    result += commision[i];
  }
  return result;
}

function PayTheActors(commissions, bookingPrices)
{
  for(var i = 0; i < actors.length; i++)
  {
    for(var j = 0; j < events.length; j++)
    {
      if(actors[i].eventId == events[j].id)
      {
        if(actors[i].payment[0] == 'booker') actors[i].payment[2] = bookingPrices[i];
        if(actors[i].payment[0] == 'bar') actors[i].payment[2] = bookingPrices - CalculateCommission(commissions[i]);
        if(actors[i].payment[0] == 'insurance') actors[i].payment[2] = commissions[i][0];
        if(actors[i].payment[0] == 'treasury') actors[i].payment[2] = commissions[i][1];
        if(actors[i].payment[0] == 'privateaser') actors[i].payment[2] = commissions[i][2];
        break
      }
    }
  }
}

GenerateBookerPrices();
PayTheActors();
console.log(bars);
console.log(events);
console.log(actors);
