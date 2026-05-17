/* Daivik's Food Journey — seed data + UI constants.
   Loaded as a regular <script> (not a module) so each `const` becomes a
   top-level global that the main inline script can use directly, exactly
   as it did when this block lived inline.

   Anything that's pure data and never references a runtime value lives here. */

/* ============================================================
   DATA: 7 weeks
   ============================================================ */
const SEED_WEEKS = [
  {id:'w1', name:'Week 1', dateLabel:'Starting 4 April 2026', focus:'Single vegetables · introducing solids',
   notes:`Feed only once a day at lunch (1:30–2:30 pm). Start with 3–5 tsp, build to 7–8 tsp.\nPressure-cook veg (4 whistles), mash with breastmilk to thick paste. No salt, sugar, ghee, oil. Use highchair, no screens. Keep 1–2 hr gap from breast/formula. Continue breastfeeding.`,
   days:[
    {n:1, slots:[{time:'Lunch', food:'Rice with breastmilk', notes:'2 tsp rice, water absorption method. Mash with 2 tsp breastmilk.'}]},
    {n:2, slots:[{time:'Lunch', food:'Orange pumpkin', notes:'Pressure cook, mash, add little breastmilk. Also give one whole piece to hold.'}]},
    {n:3, slots:[{time:'Lunch', food:'Dudhi (bottle gourd)', notes:'Same method as Day 2.'}]},
    {n:4, slots:[{time:'Lunch', food:'Carrot', notes:'From today, stop adding breastmilk to the food.'}]},
    {n:5, slots:[{time:'Lunch', food:'Green peas', notes:''}]},
    {n:6, slots:[{time:'Lunch', food:'Broccoli', notes:''}]},
    {n:7, slots:[{time:'Lunch', food:'Galka (snake gourd)', notes:''}]},
  ]},
  {id:'w2', name:'Week 2', dateLabel:'', focus:'More vegetables · self-feeding',
   notes:`Lunch only, once daily. 2–3 tsp → build to 5–6 tsp. Thick paste, no breastmilk in food. Always offer one whole piece to hold. No salt/sugar/ghee/oil. Continue breastfeeding.`,
   days:[
    {n:8, slots:[{time:'Lunch', food:'Green peas', notes:''}]},
    {n:9, slots:[{time:'Lunch', food:'Fansi (green beans)', notes:''}]},
    {n:10, slots:[{time:'Lunch', food:'Padwal without seeds', notes:''}]},
    {n:11, slots:[{time:'Lunch', food:'Beetroot', notes:''}]},
    {n:12, slots:[{time:'Lunch', food:'Turia (ridge gourd)', notes:''}]},
    {n:13, slots:[{time:'Lunch', food:'Palak (spinach)', notes:''}]},
    {n:14, slots:[{time:'Lunch', food:'Cauliflower', notes:''}]},
  ]},
  {id:'w3', name:'Week 3', dateLabel:'', focus:'Introducing dals + new veg',
   notes:`Soak dals overnight, pressure cook, temper with spices in water (no oil/ghee yet).\nSpices/condiments now allowed (1–2 at a time): hing, jeera powder, haldi, kadi patta, coriander, lemon, cinnamon.\nAll dals THICK (lachko), not soupy. Watch for allergic reactions. Continue veg variety. Eat with baby.`,
   days:[
    {n:15, slots:[{time:'Lunch', food:'Moong dal (no chilka) with hing & haldi', notes:''}]},
    {n:16, slots:[{time:'Lunch', food:'Steamed crushed sweet corn', notes:''}]},
    {n:17, slots:[{time:'Lunch', food:'Tur dal with hing & cinnamon stick', notes:''}]},
    {n:18, slots:[{time:'Lunch', food:'Steamed red capsicum (skin removed)', notes:''}]},
    {n:19, slots:[{time:'Lunch', food:'Masoor dal with kadi patta & jeera', notes:''}]},
    {n:20, slots:[{time:'Lunch', food:'Steamed mashed sweet potato', notes:''}]},
    {n:21, slots:[{time:'Lunch', food:'Steamed cucumber (no seeds)', notes:''}]},
  ]},
  {id:'w4', name:'Week 4', dateLabel:'', focus:'Whole pulses + more variety',
   notes:`Whole pulses can cause gas — let baby play after meals. Soak overnight, pressure cook, temper in water. Spices 1–2 at a time. Continue dal + veg variety. Watch for allergic reactions.`,
   days:[
    {n:22, slots:[{time:'Lunch', food:'Whole moong with hing & haldi waghar', notes:''}]},
    {n:23, slots:[{time:'Lunch', food:'Any vege from Section 1 (iron + Vit A)', notes:''}]},
    {n:24, slots:[{time:'Lunch', food:'Chole (pinch-able soft) with hing & jeera', notes:''}]},
    {n:25, slots:[{time:'Lunch', food:'Any vege from Section 2 (Vit A rich)', notes:''}]},
    {n:26, slots:[{time:'Lunch', food:'Udad dal (white) with kadi patta, hing, haldi', notes:''}]},
    {n:27, slots:[{time:'Lunch', food:'Any vege from Section 5 (nutritious)', notes:''}]},
    {n:28, slots:[{time:'Lunch', food:'Rajma (pinch-able) with hing & lemon', notes:''}]},
  ]},
  {id:'w5', name:'Week 5', dateLabel:'Starting 2 May 2026', focus:'Cereals + two meals a day',
   notes:`Now two meals: morning porridge + evening veg.\nNo honey, no sweeteners. New spices: elaichi, cinnamon, nutmeg, saffron, ginger.\nVegan milk for cooking only (homemade or small-scale producer, no tetra packs). Dry-roast cereals 30 sec before cooking. All food THICK. Watch for allergies.`,
   days:[
    {n:29, slots:[
      {time:'Morning', food:'Sprouted ragi porridge with elaichi', notes:'Roast first, then add vegan milk/water like sheera.'},
      {time:'Evening', food:'Any Vitamin A rich vege', notes:''}
    ]},
    {n:30, slots:[
      {time:'Morning', food:'Rolled oats in vegan milk/water with cinnamon', notes:''},
      {time:'Evening', food:'Any nutritious vege', notes:''}
    ]},
    {n:31, slots:[
      {time:'Morning', food:'Samo with haldi, adu, coriander, jeera', notes:'Soak 2–3 tsp samo. Cook in water/veg stock/dal stock.'},
      {time:'Evening', food:'Any iron + Vit A rich vege', notes:''}
    ]},
    {n:32, slots:[
      {time:'Morning', food:'Roasted rawa in vegan milk + nutmeg', notes:''},
      {time:'Evening', food:'Any protein rich vege', notes:''}
    ]},
    {n:33, slots:[
      {time:'Morning', food:'Poha soaked in coconut milk + elaichi', notes:''},
      {time:'Evening', food:'Any vege from healthy diet list', notes:''}
    ]},
    {n:34, slots:[
      {time:'Morning', food:'Wheat flour sheera in water/vegan milk + saffron', notes:''},
      {time:'Evening', food:'Any Vitamin A rich vege', notes:''}
    ]},
    {n:35, slots:[
      {time:'Morning', food:'Banana', notes:''},
      {time:'Evening', food:'Repeat banana if hungry', notes:''}
    ]},
    {n:36, slots:[
      {time:'Morning', food:'Mango', notes:''},
      {time:'Evening', food:'Repeat mango if hungry', notes:''}
    ]},
    {n:37, slots:[
      {time:'Morning', food:'Quinoa with haldi & coriander', notes:'Soak 30 min. Overcook in water/veg/dal stock.'},
      {time:'Evening', food:'Any nutritious vege', notes:''}
    ]},
  ]},
  {id:'w6', name:'Week 6', dateLabel:'', focus:'Fruits introduced',
   notes:`Introducing fruits — sour & medium-sweet early, very sweet later in week.\nAvoid grapes, cherries, blueberries, raspberries, blackberries, cranberries (choking hazard).\nNo lychee on empty stomach. Continue dals + cereals. Try varied textures. No sugar/honey/salt/ghee/butter/oil. Continue breastfeeding.`,
   days:[
    {n:38, slots:[{time:'Morning', food:'Sprouted ragi porridge + chia + elaichi', notes:''},{time:'Evening', food:'Mashed stewed apple', notes:''}]},
    {n:39, slots:[{time:'Morning', food:'Any dal from week 3 or 4', notes:''},{time:'Afternoon', food:'Vit A rich vege (broccoli)', notes:''},{time:'Evening', food:'Ripe guava', notes:''}]},
    {n:40, slots:[{time:'Morning', food:'Samo with potato, adu, coriander, jeera + chia', notes:''},{time:'Evening', food:'Orange', notes:''}]},
    {n:41, slots:[{time:'Morning', food:'Any dal from week 3 or 4', notes:''},{time:'Afternoon', food:'Vit A rich vege (orange pumpkin)', notes:''},{time:'Evening', food:'Mashed stewed pear', notes:''}]},
    {n:42, slots:[{time:'Morning', food:'Rolled oats in vegan milk + chia + cinnamon', notes:''},{time:'Evening', food:'Ripe papaya', notes:''}]},
    {n:43, slots:[{time:'Morning', food:'Any dal from week 3 or 4', notes:''},{time:'Afternoon', food:'Vit A rich vege (carrot)', notes:''},{time:'Evening', food:'Mosambi juice (no sugar)', notes:''}]},
    {n:44, slots:[{time:'Morning', food:'Quinoa with haldi, coriander + chia', notes:''},{time:'Evening', food:'Ripe banana', notes:''}]},
  ]},
  {id:'w7', name:'Week 7', dateLabel:'Current week', focus:'Mixed home foods · nuts & seeds · diverse diet',
   notes:`This week: 3–4 ingredient mixed home foods, like khichdi. Spices not counted as ingredients.\nGood time to start nuts & seeds (roasted, cooled, powdered, stored airtight in fridge — small batches for 3–4 days). Chia: soak in water/coconut milk 30 min before cooking.\nDiverse diet: aim for ≥5 of 8 food groups daily.`,
   days:[
    {n:45, slots:[
      {time:'Morning', food:'Stewed apple', notes:''},
      {time:'Afternoon', food:'Quinoa khichdi + pumpkin seed powder', notes:'Quinoa+dal 1:1, orange pumpkin, onion, coriander, haldi, hing, jeera. Pressure cook. Top with 1 tsp pumpkin seed powder.'},
      {time:'Evening', food:'Any dal from week 4', notes:''}
    ]},
    {n:46, slots:[
      {time:'Morning', food:'Ragi porridge + chia + almond + banana', notes:'Roast sprouted ragi, add vegan milk/water, 1 tsp chia, 1 tsp almond powder, half mashed banana.'},
      {time:'Afternoon', food:'Steamed carrots', notes:''},
      {time:'Evening', food:'Any dal from week 4', notes:''}
    ]},
    {n:47, slots:[
      {time:'Morning', food:'Ripe papaya', notes:''},
      {time:'Afternoon', food:'Any dal from week 4', notes:''},
      {time:'Evening', food:'Rice khichdi + flax seed powder', notes:'Rice+dal 1:1, broccoli, tomato, coriander, haldi, hing, jeera. Top with 1 tsp flax seed powder.'}
    ]},
    {n:48, slots:[
      {time:'Morning', food:'Stewed pear', notes:''},
      {time:'Afternoon', food:'Dalia khichdi + sunflower seed powder', notes:'Dalia+dal 1:1, 5–6 spinach leaves, green peas, coriander, haldi, hing, jeera. Top with 1 tsp sunflower seed powder.'},
      {time:'Evening', food:'Any dal from week 4', notes:''}
    ]},
    {n:49, slots:[
      {time:'Morning', food:'Oats porridge + chia + walnut + strawberry', notes:'Roast oats, vegan milk/water, 1 tsp chia, 1 tsp walnut powder, 2 strawberries.'},
      {time:'Afternoon', food:'Boiled mashed beetroot', notes:"Don't give too much — can cause diarrhoea."},
      {time:'Evening', food:'Any dal from week 4', notes:''}
    ]},
    {n:50, slots:[
      {time:'Morning', food:"Any new fruit (mom's choice)", notes:''},
      {time:'Afternoon', food:'Any dal from week 4', notes:''},
      {time:'Evening', food:'Samo with potato, adu, chia + groundnut powder', notes:'Soak samo, add haldi, grated potato/adu, coriander, jeera. Cook in water/veg/dal stock with 1 tsp chia and 1 tsp groundnut powder.'}
    ]},
    {n:51, slots:[
      {time:'Morning', food:"Any new fruit (mom's choice)", notes:''},
      {time:'Afternoon', food:'Upma with rawa, curry leaves, peas, tomato, onion + coconut & lemon', notes:'Dry roast rawa. Boil water with curry leaves, peas, tomato, onion. Add rawa, coriander, 1 tsp grated coconut, few drops lemon.'},
      {time:'Evening', food:'Any dal from week 4', notes:''}
    ]},
  ]},
];

const VEGE_LIST = [
  {section:'Iron & Vit A rich', items:['Palak','Methi','Red Amaranth','Green Amaranth','Radish leaves','Cauliflower leaves','Shepu','Spring onion']},
  {section:'Vitamin A rich', items:['Broccoli','Orange pumpkin','Beetroot','Carrot']},
  {section:'Protein rich', items:['Green peas']},
  {section:'Vitamin C rich', items:['Tomato','Lemon']},
  {section:'Nutritious', items:['Sweet corn','Red capsicum','Yellow capsicum','Green capsicum','Purple cabbage']},
  {section:'Healthy diet veges', items:['Kantola','Dudhi','Galka','Padwal','Turia','Karela','Tindli','Fansi','Alkul','Cauliflower','Cabbage','White bhopla','Brinjal','Radish','Cucumber','Lettuce','Zucchini','Celery','Bhindi','Drumstick','Guvar']},
  {section:'Minimal in diet', items:['Potato','Sweet potato','Raw banana','Kand','Suran']},
  {section:'Condiments', items:['Pudina','Basil','Coriander','Curry leaves']},
];
const DAL_LIST = [
  {section:'All pulses & dals', items:['Moong Dal with chilka','Moong dal without chilka','Tur Dal','Masoor Dal','Udad Dal (white)','Chole','Rajma','Green Moong (whole)','Chana dal','Black eyed peas','Moth beans (matki)','White vatana','Udal (whole)','Udad dal with skin','Waal','Soyabean','Kulith dal','Masoor whole','Green chana','Brown chana','Adzuki','Horse gram','Navrangi dal']},
];
const FRUIT_LIST = [
  {section:'All fruits', items:['Mango','Papaya','Avocado','Pear','Peach','Dragon fruit','Banana','Banana Alaichi','Kiwi','Mosambi','Plum','Watermelon','Oranges','Cantaloupe','Grapes','Cherry','Pineapple','Apple','Strawberry','Pomegranate','Fig','Guava','Lychee','Custard apple','Raspberries','Mulberries','Blueberries','Gooseberries','Chickoo','Jackfruit','Grapefruit']},
];

/* ============================================================
   UI CONSTANTS
   ============================================================ */
const MOODS = [
  {id:'happy', label:'😋 Loved', cls:'mood-happy'},
  {id:'meh',   label:'😐 Okay', cls:'mood-meh'},
  {id:'fuss',  label:'😣 Fussy', cls:'mood-fuss'},
  {id:'refused', label:'🙅 Refused', cls:'mood-refused'},
];
const REACTIONS = ['Rash','Vomiting','Loose stool','Constipation','Gas','Runny nose','Sneezing','Swelling','None'];
const TIME_ICONS = {Morning:'🌅', Lunch:'🍲', Afternoon:'☀️', Evening:'🌇', Snack:'🍪'};
