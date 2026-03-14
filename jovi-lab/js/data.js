// ===== CONSTANTS =====
const EMOJIS = { smartphone: '📱', smartwatch: '⌚', tws: '🎧', iot: '🔌' };
const TYPE_LABELS = { smartphone: 'Smartphone', smartwatch: 'Smartwatch', tws: 'TWS Earbuds', iot: 'IoT Device' };
const TYPE_COLORS = { smartphone: '#2ea043', smartwatch: '#388bfd', tws: '#a855f7', iot: '#22c55e' };
const TYPE_CLASS  = { smartphone: 'type-p', smartwatch: 'type-s', tws: 'type-t', iot: 'type-i' };
const CHART_COLORS = ['#3b82f6','#a855f7','#22c55e','#f59e0b','#ef4444','#06b6d4'];

// ===== SECTION DEFINITIONS =====
const DEFS = {
  smartphone: {
    scoreMap: { s_price:'Price/Value', s_display:'Display', s_perf:'Performance', s_cam:'Camera', s_batt:'Battery', s_sw:'Software', s_build:'Build' },
    sections: [
      { n:'0', k:'photo',  t:'Product Photo', sk: null },
      { n:'1', k:'price',  t:'Price & Positioning', sk:'s_price', f:[
        { tp:'num', k:'retail_price', l:'Retail Price (BRL)', h:'' },
        { tp:'sel', k:'positioning', l:'Market Positioning', h:'How does it position against direct competitors?', o:['Entry-level','Mid-range','Premium','Flagship'] },
        { tp:'sel', k:'value_money', l:'Value for Money', h:'Does the cost-benefit make sense for what it delivers?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'price_notes', l:'Notes', h:'Price vs. competitors, promotions, bundles...' }
      ]},
      { n:'2', k:'display', t:'Display', sk:'s_display', f:[
        { tp:'sel', k:'display_tech', l:'Display Technology', h:'', o:['AMOLED/OLED','LCD IPS','LCD TFT','Mini-LED'] },
        { tp:'sel', k:'refresh_rate', l:'Refresh Rate', h:'Higher refresh rate = smoother scrolling and animations', o:['144Hz+','120Hz','90Hz','60Hz'] },
        { tp:'num', k:'peak_brightness', l:'Peak Brightness (nits)', h:'Maximum brightness measured or rated' },
        { tp:'sel', k:'sunlight', l:'Sunlight Visibility', h:'Can you comfortably read the screen outdoors in direct sunlight?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'color_accuracy', l:'Color Accuracy', h:'Do colors look natural and accurate vs. oversaturated/washed out?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'display_notes', l:'Notes', h:'' }
      ]},
      { n:'3', k:'performance', t:'Performance', sk:'s_perf', f:[
        { tp:'txt', k:'chipset', l:'Chipset', h:'e.g. Snapdragon 8 Gen 3, Dimensity 9300, Apple A17 Pro' },
        { tp:'num', k:'ram', l:'RAM (GB)', h:'' },
        { tp:'num', k:'antutu', l:'AnTuTu Score', h:'Benchmark score for reference' },
        { tp:'sel', k:'daily_perf', l:'Daily Performance', h:'How does it handle day-to-day tasks like browsing, social media, multitasking?', o:['Buttery Smooth','Smooth','Minor Hiccups','Laggy'] },
        { tp:'sel', k:'gaming_perf', l:'Gaming Performance', h:'How does it handle demanding 3D games at high settings?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'thermal', l:'Thermal Throttling', h:'Does performance drop significantly after extended gaming sessions due to heat?', o:['None','Slight after 30min','Noticeable','Severe'] },
        { tp:'ta',  k:'perf_notes', l:'Notes', h:'' }
      ]},
      { n:'4', k:'camera', t:'Camera System', sk:'s_cam', f:[
        { tp:'num', k:'main_mp', l:'Main Camera (MP)', h:'' },
        { tp:'sel', k:'main_quality', l:'Main Camera Quality', h:'Overall photo quality in mixed lighting conditions', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'ultrawide', l:'Ultrawide Quality', h:'Does the ultrawide lens deliver consistent color and sharpness?', o:['Excellent','Good','Fair','Poor/None'] },
        { tp:'sel', k:'telephoto', l:'Telephoto / Zoom Quality', h:'Does the zoom camera produce sharp, usable images?', o:['Excellent','Good','Fair','Poor/None'] },
        { tp:'sel', k:'video_res', l:'Max Video Resolution', h:'Highest supported video recording resolution', o:['8K','4K 120fps','4K 60fps','4K 30fps','1080p max'] },
        { tp:'sel', k:'night_mode', l:'Night Mode Quality', h:'How well does it handle low-light photography?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'selfie', l:'Selfie Camera Quality', h:'Front camera quality for photos and video calls', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'cam_notes', l:'Notes', h:'' }
      ]},
      { n:'5', k:'battery', t:'Battery & Charging', sk:'s_batt', f:[
        { tp:'num', k:'batt_mah', l:'Battery Capacity (mAh)', h:'' },
        { tp:'num', k:'screen_on', l:'Real Screen-On Time (hours)', h:'How many hours of active screen use before needing charge?' },
        { tp:'num', k:'wired_w', l:'Wired Charging (Watts)', h:'' },
        { tp:'num', k:'wireless_w', l:'Wireless Charging (Watts)', h:'0 if not supported' },
        { tp:'sel', k:'reverse_wl', l:'Reverse Wireless Charging', h:'Can it wirelessly charge accessories like earbuds?', o:['Yes','No'] },
        { tp:'ta',  k:'batt_notes', l:'Notes', h:'' }
      ]},
      { n:'6', k:'software', t:'Software & OS', sk:'s_sw', f:[
        { tp:'txt', k:'os_ver', l:'OS Version', h:'e.g. Android 14 / One UI 6.1 / iOS 17.4' },
        { tp:'sel', k:'bloatware', l:'Bloatware Level', h:'How many pre-installed apps are non-removable?', o:['None','Minimal','Moderate','Heavy'] },
        { tp:'sel', k:'update_policy', l:'Software Update Policy', h:'How many years of OS and security updates are guaranteed?', o:['5+ years OS updates','3-4 years','1-2 years','Unclear/None'] },
        { tp:'sel', k:'ui_smooth', l:'UI Smoothness', h:'Does the interface feel fluid during animations and transitions?', o:['Very Smooth','Smooth','Minor Lag','Laggy'] },
        { tp:'ta',  k:'sw_features', l:'Unique Software Features', h:'e.g. Samsung DeX, Circle to Search, AI eraser, split-screen gaming' },
        { tp:'ta',  k:'sw_notes', l:'Notes', h:'' }
      ]},
      { n:'7', k:'build', t:'Build Quality & Ergonomics', sk:'s_build', f:[
        { tp:'sel', k:'build_mat', l:'Build Material', h:'What materials are used for the chassis and back?', o:['Titanium + Glass','Aluminum + Glass','Plastic','Other'] },
        { tp:'sel', k:'ip_rating', l:'IP Rating (Dust & Water)', h:'Official ingress protection certification', o:['IP68','IP67','IP65','IP54','No rating'] },
        { tp:'sel', k:'in_hand', l:'In-Hand Feel', h:'Does it feel premium, grippy and balanced when held?', o:['Premium','Good','Acceptable','Cheap/Slippery'] },
        { tp:'num', k:'weight', l:'Weight (grams)', h:'' },
        { tp:'sel', k:'one_hand', l:'One-Hand Usability', h:'Can you comfortably operate the phone with one hand?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'build_notes', l:'Notes', h:'' }
      ]},
      { n:'★', k:'verdict', t:'Final Verdict', sk: null }
    ]
  },

  smartwatch: {
    scoreMap: { s_price:'Price/Value', s_design:'Design/Comfort', s_display:'Display', s_usability:'Usability', s_sports:'Sports/GPS', s_health:'Health', s_smart:'Smart', s_batt:'Battery', s_app:'App' },
    sections: [
      { n:'0', k:'photo', t:'Product Photo', sk: null },
      { n:'1', k:'price', t:'Price & Positioning', sk:'s_price', f:[
        { tp:'num', k:'retail_price', l:'Retail Price (BRL)', h:'' },
        { tp:'sel', k:'positioning', l:'Market Positioning', h:'How does it position against direct competitors?', o:['Entry-level','Mid-range','Premium','Flagship'] },
        { tp:'sel', k:'value_money', l:'Value for Money', h:'Does the cost-benefit make sense for what it delivers?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'price_notes', l:'Notes', h:'Price vs. competitors, promotions, bundles...' }
      ]},
      { n:'2', k:'design', t:'Design, Build & Comfort', sk:'s_design', f:[
        { tp:'sel', k:'daily_comfort', l:'Daily Comfort', h:'Light and comfortable enough to wear all day and while sleeping?', o:['Very Comfortable','Comfortable','Acceptable','Uncomfortable'] },
        { tp:'sel', k:'band_irritation', l:'Band Skin Irritation', h:'Does the band material irritate skin when sweating?', o:['None','Slight','Moderate','Severe'] },
        { tp:'sel', k:'band_compat', l:'Third-Party Band Compatibility', h:'Easy to replace with universal third-party bands?', o:['Yes - Universal','Yes - Brand Specific','No'] },
        { tp:'sel', k:'ergonomics', l:'Ergonomics', h:'Does the case size get in the way during long-sleeve shirts or specific workout movements?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'material_feel', l:'Material Feel', h:'Does it feel premium or cheap/plasticky on the wrist?', o:['Premium','Good','Acceptable','Cheap/Plasticky'] },
        { tp:'ta',  k:'design_notes', l:'Notes', h:'' }
      ]},
      { n:'3', k:'display', t:'Display, Watch Faces & Customization', sk:'s_display', f:[
        { tp:'sel', k:'wf_change', l:'Watch Face Change Ease', h:'Is it easy and intuitive to change the watch face directly on the watch?', o:['Very Easy','Easy','Average','Difficult'] },
        { tp:'sel', k:'free_wf', l:'Free Watch Face Variety', h:'Does the app offer a good variety of quality free watch faces?', o:['Excellent','Good','Limited','Very Limited'] },
        { tp:'sel', k:'paid_wf', l:'Paid Watch Faces', h:'Are there paid watch faces? Is the price fair or abusive?', o:['None','Fair Price','Overpriced'] },
        { tp:'sel', k:'custom_photo_wf', l:'Custom Photo Watch Face', h:'Can you set a personal photo as a watch face?', o:['Yes','No'] },
        { tp:'sel', k:'raise_wake', l:'Raise-to-Wake Speed', h:'Is the screen-on gesture fast and natural, or do you need exaggerated movements?', o:['Instant','Fast','Slow','Unreliable'] },
        { tp:'sel', k:'sunlight', l:'Sunlight Visibility', h:'Is maximum brightness sufficient for reading under direct sunlight?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'display_notes', l:'Notes', h:'' }
      ]},
      { n:'4', k:'usability', t:'Usability & System Fluidity', sk:'s_usability', f:[
        { tp:'sel', k:'ui_fluidity', l:'UI Fluidity', h:'Does the system run smoothly or show lag when scrolling menus and opening apps?', o:['Very Smooth','Smooth','Minor Lag','Laggy'] },
        { tp:'sel', k:'menu_intuit', l:'Menu Intuitiveness', h:'Are menus intuitive? Easy to find basic settings like brightness, alarms, do-not-disturb?', o:['Very Intuitive','Intuitive','Confusing','Very Confusing'] },
        { tp:'sel', k:'btn_haptic', l:'Button / Crown Haptic Feedback', h:'Do physical buttons or rotary crown have good tactile response, especially with sweaty hands?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'usability_notes', l:'Notes', h:'' }
      ]},
      { n:'5', k:'sports', t:'Sports, GPS & Navigation', sk:'s_sports', f:[
        { tp:'num', k:'sport_modes', l:'Number of Sport Modes', h:'Total included sport/activity modes' },
        { tp:'sel', k:'gps_accuracy', l:'GPS Accuracy', h:'During runs/rides in dense trees or buildings, does the tracked route stay true to the street?', o:['Excellent','Good','Fair','Poor - Many Deviations'] },
        { tp:'sel', k:'offline_maps', l:'Offline Maps', h:'Does the watch support offline maps with terrain detail?', o:['Yes - Full Detail','Yes - Basic','No'] },
        { tp:'sel', k:'gpx_import', l:'GPX Route Import', h:'Can you import routes (GPX files) from other apps like Strava?', o:['Yes','No'] },
        { tp:'ta',  k:'sports_notes', l:'Notes', h:'' }
      ]},
      { n:'6', k:'health', t:'Health & Sleep Monitoring', sk:'s_health', f:[
        { tp:'sel', k:'hr_accuracy', l:'Heart Rate Accuracy (Exercise)', h:'During high arm-movement exercises (e.g. weightlifting), does the optical sensor track HR reliably or show unrealistic spikes?', o:['Excellent','Good','Fair','Poor - Many Spikes'] },
        { tp:'sel', k:'calorie_acc', l:'Calorie Calculation Accuracy', h:'Do the algorithms estimate caloric burn coherently with your actual effort?', o:['Accurate','Slightly Off','Very Inaccurate'] },
        { tp:'sel', k:'sleep_track', l:'Sleep Tracking Accuracy', h:'Does the watch correctly detect when you fell asleep and woke up?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'hrv', l:'HRV Monitoring', h:'Does the system measure Heart Rate Variability (HRV)?', o:['Yes - Reliable','Yes - Unreliable','No'] },
        { tp:'sel', k:'spo2', l:'Apnea / SpO2 Alerts', h:'Does it have reliable sleep apnea risk alerts or blood oxygen (SpO2) monitoring?', o:['Yes - Reliable','Yes - Unreliable','No'] },
        { tp:'ta',  k:'health_notes', l:'Notes', h:'' }
      ]},
      { n:'7', k:'smart', t:'Smart Features', sk:'s_smart', f:[
        { tp:'sel', k:'notif_group', l:'Notification Grouping', h:'Does the watch organize phone notifications well?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'notif_reply', l:'Notification Reply Method', h:'Can you reply to notifications? If yes, how?', o:['Full QWERTY','Voice Dictation','Preset Replies Only','Read Only'] },
        { tp:'sel', k:'voice_asst', l:'Voice Assistant Quality', h:'Does the native voice assistant understand commands well, or is it frustrating to use?', o:['Excellent','Good','Fair','Frustrating/None'] },
        { tp:'sel', k:'call_speaker', l:'Call Speaker', h:'Can you make and answer calls directly from the watch speaker? Is the audio clear?', o:['Yes - Clear Audio','Yes - Poor Audio','No'] },
        { tp:'sel', k:'nfc_pay', l:'NFC Payments', h:'Does it support NFC contactless payments in your region?', o:['Yes - Works in my region','Yes - Limited region support','No'] },
        { tp:'sel', k:'music_ctrl', l:'Music App Control', h:'Can you control music apps (play, pause, skip) directly from the watch?', o:['Yes - Full Control','Yes - Basic (Play/Pause/Skip)','No'] },
        { tp:'ta',  k:'music_apps', l:'Supported Music Apps', h:'Which apps work? (e.g. Spotify, YouTube Music, Apple Music, Amazon Music)' },
        { tp:'ta',  k:'smart_notes', l:'Notes', h:'' }
      ]},
      { n:'8', k:'battery', t:'Battery & Real Autonomy', sk:'s_batt', f:[
        { tp:'num', k:'nightly_drain', l:'Nightly Battery Drain (%)', h:'Exact % of battery consumed during one night of sleep with sensors active' },
        { tp:'num', k:'gps_drain', l:'GPS Workout Drain (% per hour)', h:'% battery consumed per 1 hour of workout with GPS active' },
        { tp:'num', k:'real_batt_days', l:'Real Battery Life (days)', h:"Forget the box claim — in your real mixed use, how many days did it last?" },
        { tp:'ta',  k:'batt_notes', l:'Notes', h:'' }
      ]},
      { n:'9', k:'app', t:'Companion App & Ecosystem', sk:'s_app', f:[
        { tp:'sel', k:'app_ui', l:'App Interface Quality', h:'Is the app clean and does it present health/workout data clearly and easily?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'subscriptions', l:'Subscription Paywalls', h:'Besides paid watch faces, are core features locked behind a monthly subscription?', o:['None','Optional Features','Core Features Locked'] },
        { tp:'sel', k:'in_app_ads', l:'In-App Ads', h:'Does the app show brand advertisements every time you open it?', o:['None','Occasional','Frequent/Annoying'] },
        { tp:'sel', k:'bt_stability', l:'Bluetooth Connection Stability', h:'Is the Bluetooth link to your phone stable or does the watch disconnect on its own?', o:['Very Stable','Stable','Occasional Drops','Frequent Drops'] },
        { tp:'ta',  k:'app_notes', l:'Notes', h:'' }
      ]},
      { n:'★', k:'verdict', t:'Final Verdict', sk: null }
    ]
  },

  tws: {
    scoreMap: { s_price:'Price/Value', s_sound:'Sound', s_anc:'ANC', s_design:'Design/Fit', s_batt:'Battery', s_conn:'Connectivity', s_ctrl:'Controls' },
    sections: [
      { n:'0', k:'photo', t:'Product Photo', sk: null },
      { n:'1', k:'price', t:'Price & Positioning', sk:'s_price', f:[
        { tp:'num', k:'retail_price', l:'Retail Price (BRL)', h:'' },
        { tp:'sel', k:'positioning', l:'Market Positioning', h:'', o:['Entry-level','Mid-range','Premium','Flagship'] },
        { tp:'sel', k:'value_money', l:'Value for Money', h:'Is the asking price justified?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'price_notes', l:'Notes', h:'' }
      ]},
      { n:'2', k:'sound', t:'Sound Quality', sk:'s_sound', f:[
        { tp:'sel', k:'driver', l:'Driver Type', h:'What transducer technology is used?', o:['Dynamic','Balanced Armature','Hybrid','Planar'] },
        { tp:'sel', k:'bass', l:'Bass Quality', h:'Is the low end punchy and controlled, or muddy?', o:['Excellent','Good','Fair','Weak/Muddy'] },
        { tp:'sel', k:'mids', l:'Mids Quality', h:'Are vocals and instruments natural and present?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'treble', l:'Treble Quality', h:'Are highs detailed without harshness or sibilance?', o:['Excellent','Good','Fair','Harsh/Sibilant'] },
        { tp:'sel', k:'soundstage', l:'Soundstage', h:'Does music feel spacious and immersive, or closed/in-head?', o:['Wide & Immersive','Good','Narrow','Very Narrow'] },
        { tp:'sel', k:'eq_support', l:'EQ / App Support', h:'Does the companion app offer EQ customization?', o:['Full parametric EQ','Preset EQ only','No EQ'] },
        { tp:'ta',  k:'sound_notes', l:'Notes', h:'' }
      ]},
      { n:'3', k:'anc', t:'ANC & Transparency Mode', sk:'s_anc', f:[
        { tp:'sel', k:'anc_eff', l:'ANC Effectiveness', h:'How well does it block ambient noise (e.g. office, plane, street)?', o:['Excellent','Good','Fair','Poor/None'] },
        { tp:'sel', k:'anc_sound', l:'ANC Impact on Sound Quality', h:'Does activating ANC degrade the audio quality?', o:['No impact','Slight degradation','Noticeable degradation'] },
        { tp:'sel', k:'transparency', l:'Transparency Mode', h:'Does passthrough mode sound natural, like not wearing earbuds?', o:['Natural & Clear','Good','Muffled','None'] },
        { tp:'sel', k:'wind_noise', l:'Wind Noise Handling (ANC on)', h:'Does wind cause loud noise artifacts when ANC is active?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'anc_notes', l:'Notes', h:'' }
      ]},
      { n:'4', k:'design', t:'Design, Fit & Build', sk:'s_design', f:[
        { tp:'sel', k:'fit_type', l:'Fit Type', h:'', o:['In-ear (silicone tips)','Semi-in-ear','Open-ear (hook)','Over-ear'] },
        { tp:'sel', k:'comfort', l:'Comfort for Long Sessions', h:'Can you wear them comfortably for 2+ hours without ear fatigue?', o:['Excellent (4h+)','Good (2-4h)','Fair (1-2h)','Uncomfortable (<1h)'] },
        { tp:'sel', k:'tip_sizes', l:'Ear Tip Sizes Included', h:'How many silicone tip sizes are provided in the box?', o:['XS/S/M/L/XL (5 sizes)','S/M/L (3 sizes)','Only 1 size'] },
        { tp:'sel', k:'ipx', l:'IPX / Water Resistance Rating', h:'Is there official water/sweat resistance certification?', o:['IPX8','IPX7','IPX5/IPX4','No rating'] },
        { tp:'sel', k:'build_quality', l:'Build Quality', h:'Do the earbuds and case feel premium or cheap?', o:['Premium','Good','Acceptable','Cheap/Plasticky'] },
        { tp:'ta',  k:'design_notes', l:'Notes', h:'' }
      ]},
      { n:'5', k:'battery', t:'Battery & Charging', sk:'s_batt', f:[
        { tp:'num', k:'earbud_hrs', l:'Earbud Battery Life (hours)', h:'Real-world battery life per charge (ANC off)' },
        { tp:'num', k:'case_hrs', l:'Total with Case (hours)', h:'Total playtime including all charges from the case' },
        { tp:'txt', k:'fast_charge', l:'Fast Charge', h:'e.g. 10 min charge = 2h playback' },
        { tp:'sel', k:'wireless_case', l:'Wireless Charging Case', h:'Does the charging case support Qi wireless charging?', o:['Yes','No'] },
        { tp:'ta',  k:'batt_notes', l:'Notes', h:'' }
      ]},
      { n:'6', k:'connectivity', t:'Calls & Connectivity', sk:'s_conn', f:[
        { tp:'sel', k:'mic_quality', l:'Call Microphone Quality', h:'How do you sound to the other person on calls?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'wind_call', l:'Wind Noise Rejection (Calls)', h:'Does wind interfere with call clarity?', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'multipoint', l:'Multipoint Connection', h:'Can the earbuds connect to 2 devices simultaneously?', o:['Yes - Seamless','Yes - Manual switch','No'] },
        { tp:'txt', k:'codec_support', l:'Codec Support', h:'e.g. AAC, aptX HD, LDAC, LC3/LE Audio' },
        { tp:'sel', k:'latency', l:'Latency (Video/Gaming)', h:'Is there noticeable audio/video desync when watching or gaming?', o:['Excellent (<40ms)','Good (40-80ms)','Acceptable (80-150ms)','High (>150ms)'] },
        { tp:'ta',  k:'conn_notes', l:'Notes', h:'' }
      ]},
      { n:'7', k:'controls', t:'Controls & Companion App', sk:'s_ctrl', f:[
        { tp:'sel', k:'touch_ease', l:'Touch Controls Ease of Use', h:'Are touch gestures reliable and intuitive to use?', o:['Excellent','Good','Fair','Frustrating'] },
        { tp:'sel', k:'accidental_touch', l:'Accidental Touch Rate', h:'Do earbuds accidentally trigger actions when adjusting them?', o:['Never','Rarely','Sometimes','Frequently'] },
        { tp:'sel', k:'wear_detect', l:'Wear Detection (Auto Pause)', h:'Does the auto-pause when removing earbuds work reliably?', o:['Yes - Reliable','Yes - Unreliable','No'] },
        { tp:'sel', k:'app_quality', l:'Companion App Quality', h:'Is the companion app well-designed and useful?', o:['Excellent','Good','Fair','Poor/None'] },
        { tp:'ta',  k:'ctrl_notes', l:'Notes', h:'' }
      ]},
      { n:'★', k:'verdict', t:'Final Verdict', sk: null }
    ]
  },

  iot: {
    scoreMap: { s_price:'Price/Value', s_conn:'Connectivity', s_perf:'Performance', s_app:'App', s_batt:'Battery', s_sec:'Security', s_use:'Usability' },
    sections: [
      { n:'0', k:'photo', t:'Product Photo', sk: null },
      { n:'1', k:'price', t:'Price & Positioning', sk:'s_price', f:[
        { tp:'num', k:'retail_price', l:'Retail Price (BRL)', h:'' },
        { tp:'sel', k:'positioning', l:'Market Positioning', h:'', o:['Entry-level','Mid-range','Premium','Flagship'] },
        { tp:'sel', k:'value_money', l:'Value for Money', h:'', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'price_notes', l:'Notes', h:'' }
      ]},
      { n:'2', k:'connectivity', t:'Connectivity', sk:'s_conn', f:[
        { tp:'sel', k:'wifi', l:'Wi-Fi Standard', h:'', o:['Wi-Fi 6E','Wi-Fi 6','Wi-Fi 5','Wi-Fi 4'] },
        { tp:'sel', k:'protocols', l:'Smart Home Protocols', h:'', o:['Matter + Thread + Zigbee','Matter + Thread','Zigbee only','Proprietary only'] },
        { tp:'ta',  k:'conn_notes', l:'Notes', h:'' }
      ]},
      { n:'3', k:'performance', t:'Performance', sk:'s_perf', f:[
        { tp:'sel', k:'response', l:'Responsiveness', h:'', o:['Instant','Fast','Acceptable','Slow'] },
        { tp:'sel', k:'reliability', l:'Reliability', h:'', o:['Very Reliable','Reliable','Occasional Issues','Unreliable'] },
        { tp:'ta',  k:'perf_notes', l:'Notes', h:'' }
      ]},
      { n:'4', k:'app', t:'App & Ecosystem', sk:'s_app', f:[
        { tp:'sel', k:'app_quality', l:'App Interface Quality', h:'', o:['Excellent','Good','Fair','Poor'] },
        { tp:'sel', k:'integrations', l:'Third-Party Integrations', h:'', o:['All major platforms','Most platforms','Limited','None'] },
        { tp:'sel', k:'subscriptions', l:'Subscription Paywalls', h:'', o:['None','Optional Features','Core Features Locked'] },
        { tp:'ta',  k:'app_notes', l:'Notes', h:'' }
      ]},
      { n:'5', k:'battery', t:'Battery / Power', sk:'s_batt', f:[
        { tp:'sel', k:'power_type', l:'Power Type', h:'', o:['Battery powered','Plug-in','Solar + Battery','USB-C'] },
        { tp:'num', k:'batt_life', l:'Battery Life (months)', h:'If battery powered' },
        { tp:'ta',  k:'batt_notes', l:'Notes', h:'' }
      ]},
      { n:'6', k:'security', t:'Security & Privacy', sk:'s_sec', f:[
        { tp:'sel', k:'local_proc', l:'Local Processing', h:'', o:['Fully local','Mostly local','Cloud dependent','Cloud only'] },
        { tp:'sel', k:'sec_updates', l:'Security Updates', h:'', o:['Regular updates','Occasional','Rarely','None'] },
        { tp:'ta',  k:'sec_notes', l:'Notes', h:'' }
      ]},
      { n:'7', k:'usability', t:'Usability', sk:'s_use', f:[
        { tp:'sel', k:'setup', l:'Setup Difficulty', h:'', o:['Very Easy','Easy','Moderate','Difficult'] },
        { tp:'sel', k:'daily_use', l:'Daily Use', h:'', o:['Excellent','Good','Fair','Poor'] },
        { tp:'ta',  k:'use_notes', l:'Notes', h:'' }
      ]},
      { n:'★', k:'verdict', t:'Final Verdict', sk: null }
    ]
  }
};

// ===== SCORE HELPERS =====
function calcOverall(r) {
  const sm = DEFS[r.type].scoreMap;
  const vals = Object.keys(sm).map(k => r[k]).filter(v => v && v > 0);
  if (!vals.length) return null;
  return Math.round((vals.reduce((a,b) => a + b, 0) / vals.length) * 10) / 10;
}
function scoreClass(s) { if (!s) return 's-x'; if (s >= 8) return 's-g'; if (s >= 5) return 's-y'; return 's-r'; }
function barColor(s)   { if (!s) return '#374151'; if (s >= 8) return '#22c55e'; if (s >= 5) return '#f59e0b'; return '#ef4444'; }
function scoreColor(s) { if (!s) return '#6e7681'; if (s >= 8) return '#22c55e'; if (s >= 5) return '#f59e0b'; return '#ef4444'; }
function scoreBoxClass(s) { if (!s) return ''; if (s >= 8) return 'green'; if (s >= 5) return 'yellow'; return 'red'; }
function ratingClass(n, selected) {
  if (n > selected) return '';
  if (selected >= 8) return 'selected';
  if (selected >= 5) return 'selected range-yellow';
  return 'selected range-red';
}
