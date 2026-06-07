// =============================================================
// FitHerNova Food Section Upgrade — Global + African + Nigerian
// Version: 2.0 | Apply by adding <script src="food-patch.js"></script>
// before </body> in your index.html
// =============================================================

(function applyFoodSectionUpgrade() {
  'use strict';

  // ── EXPANDED GLOBAL FOOD DATABASE ──────────────────────────
  var GLOBAL_FOODS = [
    // GLOBAL MEALS
    { name:'Grilled Chicken Salad', cal:320, p:35, c:12, f:14, portion:'1 bowl (350g)', cat:'global' },
    { name:'Oats with Berries', cal:280, p:10, c:48, f:6, portion:'1 bowl (300g)', cat:'global' },
    { name:'Salmon with Brown Rice', cal:480, p:38, c:42, f:16, portion:'1 plate (400g)', cat:'global' },
    { name:'Egg Wrap (Whole Wheat)', cal:360, p:22, c:34, f:14, portion:'1 wrap (220g)', cat:'global' },
    { name:'Greek Yogurt Bowl', cal:220, p:18, c:28, f:4, portion:'1 bowl (300g)', cat:'global' },
    { name:'Smoothie Bowl', cal:310, p:12, c:52, f:7, portion:'1 bowl (350g)', cat:'global' },
    { name:'Turkey Sandwich (Whole Wheat)', cal:380, p:28, c:38, f:10, portion:'1 sandwich (250g)', cat:'global' },
    { name:'Baked Salmon Fillet', cal:416, p:40, c:0, f:26, portion:'200g fillet', cat:'global' },
    { name:'Quinoa Power Bowl', cal:380, p:15, c:58, f:9, portion:'1 bowl (350g)', cat:'global' },
    { name:'Veggie Stir Fry with Tofu', cal:260, p:18, c:28, f:9, portion:'1 plate (350g)', cat:'global' },
    { name:'Avocado Toast (2 slices)', cal:340, p:10, c:36, f:18, portion:'2 slices', cat:'global' },
    { name:'Tuna Salad Bowl', cal:280, p:32, c:8, f:12, portion:'1 bowl (300g)', cat:'global' },
    { name:'Chicken Caesar Wrap', cal:420, p:30, c:38, f:16, portion:'1 wrap (280g)', cat:'global' },
    { name:'Lentil Soup', cal:230, p:18, c:38, f:3, portion:'1 bowl (350g)', cat:'global' },
    { name:'Mixed Berry Smoothie', cal:190, p:6, c:38, f:2, portion:'1 glass (400ml)', cat:'global' },
    { name:'Boiled Eggs (2)', cal:155, p:13, c:1, f:11, portion:'2 large eggs', cat:'global' },
    { name:'Protein Shake', cal:130, p:25, c:6, f:2, portion:'1 shake (400ml)', cat:'global' },
    { name:'Overnight Oats', cal:310, p:12, c:54, f:7, portion:'1 jar (350g)', cat:'global' },
    { name:'Baked Cod with Veggies', cal:280, p:30, c:18, f:8, portion:'1 plate (380g)', cat:'global' },
    { name:'Whole Wheat Pasta + Chicken', cal:480, p:32, c:60, f:10, portion:'1 plate (380g)', cat:'global' },
    // AFRICAN MEALS
    { name:'Grilled Fish with Vegetables', cal:280, p:32, c:12, f:10, portion:'1 plate (350g)', cat:'african' },
    { name:'Rice and Stew (Portion Controlled)', cal:380, p:14, c:62, f:9, portion:'1 plate (300g)', cat:'african' },
    { name:'Beans and Plantain', cal:420, p:18, c:72, f:8, portion:'1 plate (400g)', cat:'african' },
    { name:'Chicken Pepper Soup', cal:190, p:24, c:5, f:8, portion:'1 bowl (350g)', cat:'african' },
    { name:'Vegetable Soup (Efo Riro)', cal:200, p:14, c:8, f:14, portion:'1 bowl (250g)', cat:'african' },
    { name:'Yam and Egg Sauce', cal:340, p:14, c:58, f:8, portion:'1 plate (350g)', cat:'african' },
    { name:'Grilled Tilapia', cal:145, p:28, c:0, f:3, portion:'1 medium (180g)', cat:'african' },
    { name:'Ugali with Sukuma Wiki', cal:310, p:9, c:58, f:5, portion:'1 plate (350g)', cat:'african' },
    { name:'Jerk Chicken (African-Style)', cal:240, p:30, c:6, f:11, portion:'1 portion (180g)', cat:'african' },
    { name:'Ndole (Cameroon Greens)', cal:260, p:14, c:12, f:18, portion:'1 bowl (280g)', cat:'african' },
    { name:'Groundnut Stew with Plantain', cal:450, p:22, c:52, f:20, portion:'1 plate (380g)', cat:'african' },
    { name:'Fufu with Light Soup', cal:380, p:12, c:72, f:7, portion:'1 plate (350g)', cat:'african' },
    { name:'Kelewele (Spiced Plantain)', cal:220, p:2, c:50, f:5, portion:'1 portion (200g)', cat:'african' },
    { name:'Grilled Suya Skewers', cal:210, p:26, c:4, f:11, portion:'2 skewers (150g)', cat:'african' },
    { name:'African Vegetable Stew', cal:180, p:8, c:20, f:9, portion:'1 bowl (280g)', cat:'african' },
    { name:'Injera with Lentils (Ethiopian)', cal:290, p:12, c:54, f:3, portion:'1 plate (350g)', cat:'african' },
    { name:'Egusi Soup (West African)', cal:320, p:18, c:8, f:24, portion:'1 bowl (250g)', cat:'african' },
    // NIGERIAN MEALS
    { name:'Jollof Rice (Portion Controlled)', cal:320, p:7, c:60, f:7, portion:'1 small plate (250g)', cat:'nigerian' },
    { name:'Moi Moi', cal:200, p:12, c:22, f:8, portion:'1 wrap (200g)', cat:'nigerian' },
    { name:'Egusi Soup with Small Swallow', cal:480, p:22, c:68, f:18, portion:'bowl + swallow (400g)', cat:'nigerian' },
    { name:'Okra Soup', cal:175, p:12, c:10, f:12, portion:'1 bowl (250g)', cat:'nigerian' },
    { name:'Beans (Less Oil)', cal:220, p:14, c:38, f:4, portion:'1 bowl (280g)', cat:'nigerian' },
    { name:'Boiled Yam and Egg', cal:320, p:14, c:52, f:8, portion:'1 plate (350g)', cat:'nigerian' },
    { name:'Fried Rice', cal:360, p:9, c:58, f:11, portion:'1 plate (280g)', cat:'nigerian' },
    { name:'Pepper Soup (Catfish)', cal:180, p:22, c:4, f:8, portion:'1 bowl (300g)', cat:'nigerian' },
    { name:'Akara (Bean Fritters)', cal:240, p:10, c:28, f:10, portion:'4 pieces (150g)', cat:'nigerian' },
    { name:'Eba and Egusi Soup', cal:500, p:20, c:78, f:16, portion:'1 plate (400g)', cat:'nigerian' },
    { name:'Pounded Yam and Efo Riro', cal:520, p:18, c:80, f:16, portion:'1 plate (420g)', cat:'nigerian' },
    { name:'Jollof Rice and Chicken', cal:520, p:32, c:62, f:14, portion:'1 plate (400g)', cat:'nigerian' },
    { name:'Fried Plantain (Dodo)', cal:240, p:2, c:50, f:7, portion:'6 slices (150g)', cat:'nigerian' },
    { name:'Groundnut Soup', cal:350, p:20, c:10, f:26, portion:'1 bowl (250g)', cat:'nigerian' },
    { name:'Banga Soup', cal:290, p:16, c:7, f:22, portion:'1 bowl (250g)', cat:'nigerian' },
    { name:'Suya (Beef Skewer)', cal:220, p:26, c:4, f:11, portion:'2 sticks (150g)', cat:'nigerian' },
    { name:'Agege Bread + Egg', cal:290, p:14, c:32, f:12, portion:'2 slices + 2 eggs', cat:'nigerian' },
    { name:'Moi Moi with Salad', cal:280, p:14, c:26, f:10, portion:'1 wrap + salad', cat:'nigerian' },
    { name:'Afang Soup', cal:260, p:18, c:6, f:19, portion:'1 bowl (250g)', cat:'nigerian' },
    { name:'Edikang Ikong', cal:250, p:20, c:5, f:18, portion:'1 bowl (250g)', cat:'nigerian' },
    // LOW CALORIE
    { name:'Moi Moi with Green Salad', cal:250, p:14, c:24, f:8, portion:'1 wrap + salad bowl', cat:'lowcal' },
    { name:'Grilled Fish and Vegetables', cal:240, p:30, c:10, f:8, portion:'1 plate (300g)', cat:'lowcal' },
    { name:'Chicken Pepper Soup (No Swallow)', cal:190, p:24, c:5, f:8, portion:'1 bowl (350g)', cat:'lowcal' },
    { name:'Oats and Fruit', cal:280, p:8, c:52, f:5, portion:'1 bowl + 1 banana', cat:'lowcal' },
    { name:'Boiled Eggs and Avocado', cal:280, p:14, c:9, f:22, portion:'2 eggs + half avocado', cat:'lowcal' },
    { name:'Vegetable Soup with Lean Protein', cal:220, p:20, c:10, f:10, portion:'1 bowl (300g)', cat:'lowcal' },
    { name:'Greek Yogurt and Berries', cal:180, p:14, c:24, f:3, portion:'1 cup + berries', cat:'lowcal' },
    { name:'Cucumber and Hummus', cal:120, p:5, c:14, f:6, portion:'1 snack portion', cat:'lowcal' },
    { name:'Watermelon Salad', cal:80, p:2, c:20, f:1, portion:'1 bowl (300g)', cat:'lowcal' },
    { name:'Spinach Green Smoothie', cal:140, p:6, c:22, f:3, portion:'1 glass (400ml)', cat:'lowcal' },
    { name:'Boiled Sweet Potato', cal:160, p:3, c:37, f:1, portion:'1 medium (200g)', cat:'lowcal' },
    { name:'Grilled Chicken Breast', cal:165, p:31, c:0, f:4, portion:'150g', cat:'lowcal' },
    { name:'Tuna and Cucumber Wrap', cal:260, p:28, c:24, f:6, portion:'1 wrap (220g)', cat:'lowcal' },
    { name:'Okra Soup (Small Portion)', cal:140, p:10, c:8, f:9, portion:'1 small bowl (180g)', cat:'lowcal' },
    { name:'Hard Boiled Eggs (2)', cal:155, p:13, c:1, f:11, portion:'2 large eggs', cat:'lowcal' },
    // BREAKFAST
    { name:'Oatmeal with Honey', cal:240, p:8, c:44, f:5, portion:'1 bowl (300g)', cat:'breakfast' },
    { name:'Ogi / Akamu (Corn Pap)', cal:100, p:2, c:23, f:1, portion:'1 bowl (250ml)', cat:'breakfast' },
    { name:'Scrambled Eggs on Toast', cal:280, p:18, c:24, f:12, portion:'2 eggs + 2 slices', cat:'breakfast' },
    { name:'Moi Moi (Morning)', cal:200, p:12, c:22, f:8, portion:'1 wrap (200g)', cat:'breakfast' },
    { name:'Whole Wheat Bread + Egg', cal:290, p:16, c:30, f:12, portion:'2 slices + 2 eggs', cat:'breakfast' },
    { name:'Golden Morn + Milk', cal:250, p:8, c:44, f:6, portion:'1 bowl with milk', cat:'breakfast' },
    { name:'Banana Oat Pancakes', cal:310, p:10, c:52, f:8, portion:'3 pancakes (200g)', cat:'breakfast' },
    { name:'Avocado and Egg Toast', cal:340, p:16, c:28, f:18, portion:'2 slices + 1 egg', cat:'breakfast' },
    { name:'Smoothie Bowl with Granola', cal:360, p:12, c:58, f:9, portion:'1 bowl (350g)', cat:'breakfast' },
    { name:'Boiled Yam + Eggs', cal:320, p:14, c:52, f:8, portion:'2 pieces yam + 2 eggs', cat:'breakfast' },
    { name:'Pap with Soya Milk', cal:140, p:7, c:20, f:4, portion:'1 bowl (300ml)', cat:'breakfast' },
    { name:'Overnight Oats with Fruit', cal:310, p:11, c:54, f:7, portion:'1 jar (350g)', cat:'breakfast' },
    { name:'Plantain and Eggs', cal:350, p:14, c:52, f:11, portion:'1 plate (300g)', cat:'breakfast' },
    { name:'Cornflakes with Milk', cal:230, p:8, c:40, f:5, portion:'1 bowl (250g)', cat:'breakfast' },
    // LUNCH
    { name:'Jollof Rice + Grilled Chicken', cal:520, p:32, c:62, f:14, portion:'1 plate (400g)', cat:'lunch' },
    { name:'Rice and Beans', cal:340, p:14, c:60, f:6, portion:'1 plate (320g)', cat:'lunch' },
    { name:'Grilled Chicken and Salad', cal:320, p:35, c:12, f:14, portion:'1 plate (380g)', cat:'lunch' },
    { name:'Egusi Soup and Pounded Yam', cal:540, p:22, c:82, f:18, portion:'1 plate (420g)', cat:'lunch' },
    { name:'Beans Porridge', cal:280, p:15, c:44, f:6, portion:'1 bowl (300g)', cat:'lunch' },
    { name:'Yam Porridge (Asaro)', cal:300, p:7, c:62, f:7, portion:'1 bowl (320g)', cat:'lunch' },
    { name:'Fried Rice + Grilled Fish', cal:440, p:30, c:52, f:14, portion:'1 plate (380g)', cat:'lunch' },
    { name:'Chicken Wrap + Side Salad', cal:420, p:28, c:42, f:14, portion:'1 wrap + salad', cat:'lunch' },
    { name:'Quinoa and Grilled Chicken', cal:420, p:36, c:48, f:10, portion:'1 bowl (380g)', cat:'lunch' },
    { name:'Tuna Pasta (Whole Wheat)', cal:460, p:30, c:58, f:10, portion:'1 plate (380g)', cat:'lunch' },
    { name:'Vegetable Stew with Rice', cal:380, p:10, c:68, f:8, portion:'1 plate (380g)', cat:'lunch' },
    { name:'Grilled Salmon Bowl', cal:480, p:38, c:42, f:16, portion:'1 bowl (400g)', cat:'lunch' },
    { name:'Ogbono Soup + Swallow', cal:480, p:18, c:72, f:18, portion:'1 plate (380g)', cat:'lunch' },
    { name:'Edikang Ikong + Eba', cal:450, p:22, c:70, f:14, portion:'1 plate (380g)', cat:'lunch' },
    // DINNER
    { name:'Grilled Chicken + Veggies', cal:280, p:32, c:14, f:10, portion:'1 plate (350g)', cat:'dinner' },
    { name:'Pepper Soup + Small Swallow', cal:350, p:24, c:44, f:10, portion:'bowl + swallow', cat:'dinner' },
    { name:'Light Vegetable Soup', cal:160, p:10, c:14, f:7, portion:'1 bowl (280g)', cat:'dinner' },
    { name:'Baked Tilapia + Salad', cal:260, p:32, c:10, f:9, portion:'1 plate (350g)', cat:'dinner' },
    { name:'Okra Soup + Small Eba', cal:380, p:15, c:60, f:12, portion:'bowl + small swallow', cat:'dinner' },
    { name:'Steamed Fish with Veggies', cal:240, p:30, c:12, f:8, portion:'1 plate (320g)', cat:'dinner' },
    { name:'Chicken Stir Fry', cal:300, p:28, c:18, f:12, portion:'1 plate (350g)', cat:'dinner' },
    { name:'Lentil and Spinach Soup', cal:220, p:16, c:32, f:4, portion:'1 bowl (350g)', cat:'dinner' },
    { name:'Grilled Mackerel + Plantain', cal:380, p:28, c:38, f:14, portion:'1 plate (350g)', cat:'dinner' },
    { name:'Efo Riro + Small Swallow', cal:380, p:16, c:58, f:12, portion:'1 plate (350g)', cat:'dinner' },
    { name:'Turkey and Vegetable Stew', cal:260, p:28, c:14, f:10, portion:'1 bowl (300g)', cat:'dinner' },
    { name:'Cauliflower Rice + Chicken', cal:280, p:30, c:20, f:8, portion:'1 plate (350g)', cat:'dinner' },
    { name:'Bitter Leaf Soup + Fufu', cal:460, p:18, c:72, f:14, portion:'1 plate (380g)', cat:'dinner' },
    // SNACKS
    { name:'Puff Puff (3 pieces)', cal:180, p:3, c:22, f:9, portion:'3 pieces (100g)', cat:'snack' },
    { name:'Akara (3 pieces)', cal:160, p:8, c:18, f:7, portion:'3 pieces (100g)', cat:'snack' },
    { name:'Roasted Groundnuts', cal:280, p:13, c:8, f:24, portion:'handful (50g)', cat:'snack' },
    { name:'Chin Chin (small portion)', cal:200, p:4, c:28, f:9, portion:'half cup (40g)', cat:'snack' },
    { name:'Boli (Roasted Plantain)', cal:220, p:2, c:52, f:1, portion:'1 medium (200g)', cat:'snack' },
    { name:'Greek Yogurt with Honey', cal:160, p:12, c:22, f:2, portion:'1 cup (200g)', cat:'snack' },
    { name:'Apple with Peanut Butter', cal:210, p:5, c:28, f:10, portion:'1 apple + 1 tbsp', cat:'snack' },
    { name:'Mixed Nuts and Dried Fruit', cal:220, p:6, c:22, f:14, portion:'handful (40g)', cat:'snack' },
    { name:'Watermelon Slices', cal:80, p:2, c:20, f:1, portion:'2 slices (300g)', cat:'snack' },
    { name:'Boiled Corn', cal:130, p:4, c:28, f:2, portion:'1 medium cob (150g)', cat:'snack' },
    { name:'Banana', cal:90, p:1, c:23, f:0, portion:'1 medium (100g)', cat:'snack' },
    { name:'Mango Slices', cal:100, p:1, c:25, f:1, portion:'1 cup (165g)', cat:'snack' },
    { name:'Meat Pie', cal:320, p:10, c:35, f:16, portion:'1 piece (150g)', cat:'snack' },
    { name:'Avocado (half)', cal:160, p:2, c:9, f:15, portion:'half avocado (100g)', cat:'snack' },
    { name:'Rice Cakes with Hummus', cal:150, p:5, c:22, f:5, portion:'2 cakes + 2 tbsp', cat:'snack' },
    { name:'Hard Boiled Egg', cal:78, p:6, c:1, f:5, portion:'1 large egg', cat:'snack' },
    { name:'Dark Chocolate (2 squares)', cal:110, p:2, c:12, f:7, portion:'20g', cat:'snack' },
    { name:'Zobo Drink', cal:60, p:1, c:14, f:0, portion:'1 glass (300ml)', cat:'snack' },
  ];

  // ── OVERRIDE NIGERIAN_FOODS with global version ─────────────
  // This runs after the page loads and replaces the built-in database
  window.NIGERIAN_FOODS = GLOBAL_FOODS;

  // ── CATEGORY FILTER UPDATE ──────────────────────────────────
  // Override filterFoodCat to handle new category names
  var _origFilterFoodCat = window.filterFoodCat;
  window.filterFoodCat = function(cat, el) {
    window._foodCatFilter = cat;
    var q = document.getElementById('nigerian-food-search') ? document.getElementById('nigerian-food-search').value : '';
    document.querySelectorAll('.fcat').forEach(function(c) { c.classList.remove('active'); });
    if (el) el.classList.add('active');
    if (q && q.length >= 1) {
      window.searchNigerianFood(q);
    } else {
      window.showFoodCategory(cat);
    }
  };

  // ── UI PATCHES ──────────────────────────────────────────────
  function patchUI() {
    var foodPage = document.getElementById('page-food');
    if (!foodPage) { setTimeout(patchUI, 300); return; }

    // 1. Update search placeholder
    var searchEl = document.getElementById('nigerian-food-search');
    if (searchEl) {
      searchEl.placeholder = '\uD83D\uDD0D Search meals... (e.g. jollof rice, salmon, oats)';
    }

    // 2. Replace category chips
    var chipsEl = document.getElementById('food-cat-chips');
    if (chipsEl) {
      chipsEl.innerHTML = [
        ['all',       'All'],
        ['global',    '\u2708\uFE0F Global'],
        ['african',   '\uD83C\uDF0D African'],
        ['nigerian',  '\uD83C\uDDF3\uD83C\uDDEC Nigerian'],
        ['lowcal',    '\uD83E\uDD57 Low-Cal'],
        ['breakfast', '\u2600\uFE0F Breakfast'],
        ['lunch',     '\uD83C\uDF24\uFE0F Lunch'],
        ['dinner',    '\uD83C\uDF19 Dinner'],
        ['snack',     '\uD83C\uDF7F Snacks'],
      ].map(function(item, i) {
        return '<div class="fcat' + (i === 0 ? ' active' : '') + '" onclick="filterFoodCat(\'' + item[0] + '\',this)">' + item[1] + '</div>';
      }).join('');
    }

    // 3. Add intro banner at top of food page (if not already added)
    if (!document.getElementById('food-global-banner')) {
      var secLabel = foodPage.querySelector('.sec-label');
      if (secLabel) {
        var banner = document.createElement('div');
        banner.id = 'food-global-banner';
        banner.style.cssText = 'background:linear-gradient(135deg,#0e0a1a,#0a1218);border:1px solid rgba(255,209,102,.2);border-radius:16px;padding:12px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;';
        banner.innerHTML = '<div style="font-size:24px;flex-shrink:0;">\uD83C\uDF0D</div><div style="font-size:12px;color:rgba(255,255,255,.7);line-height:1.55;">Explore healthy meals from global, African, and Nigerian options \u2014 with calorie-friendly choices to support your fitness journey.</div>';
        foodPage.insertBefore(banner, secLabel);
      }
    }

    // 4. Add Healthier Swaps card before .card (food-log-list)
    if (!document.getElementById('healthier-swaps-card')) {
      var foodLogCard = foodPage.querySelector('.card');
      if (foodLogCard) {
        var swapsCard = document.createElement('div');
        swapsCard.id = 'healthier-swaps-card';
        swapsCard.style.cssText = 'background:linear-gradient(135deg,#071a12,#0e0e0e);border:1px solid rgba(6,214,160,.3);border-radius:18px;padding:14px;margin-bottom:12px;';
        swapsCard.innerHTML = '<div style="font-family:\'Syne\',sans-serif;font-size:13px;font-weight:800;color:#06d6a0;margin-bottom:10px;">\uD83D\uDCA1 Healthier Swap Ideas</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
          '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.75);">\uD83C\uDF72 Smaller swallow portion</div>' +
          '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.75);">\uD83E\uDD66 Add more vegetables</div>' +
          '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.75);">\uD83D\uDD25 Grilled not fried</div>' +
          '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.75);">\uD83E\uFAD9 Less oil, same taste</div>' +
          '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.75);">\uD83D\uDCAA Add lean protein</div>' +
          '<div style="background:rgba(255,255,255,.04);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.75);">\uD83C\uDF5A Controlled rice portion</div>' +
          '</div>';
        foodPage.insertBefore(swapsCard, foodLogCard);
      }
    }

    console.log('[FitHerNova] Food section upgraded: 131 global meals, 8 categories \u2713');
  }

  // Apply when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(patchUI, 800); });
  } else {
    setTimeout(patchUI, 800);
  }

})();
