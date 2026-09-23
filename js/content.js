/* All page text lives here. Source: "QIYADA QF Space_WHAT IS YOUR HEART FEELING 2.docx".
   Each feeling has one or more texts. type "ayah" is shown in ﴿ ﴾ with its reference; type "dua" has no reference.
   Quotation marks are added by the page, so leave them out of the strings. */
window.QF_CONTENT = {
  ui: {
    heading:     { en: 'How are you feeling?', ar: 'كيف حالك؟' },
    instruction: {
      en: 'Choose the feeling that best reflects how you feel. An ayah or du’a may be just what you need to hear.',
      ar: 'اختر الشعور الذي يعبر عن إحساسك، واستمع إلى آية أو دعاء قد تحتاج إلى سماعه.'
    },
    back:        { en: 'Choose another feeling', ar: 'اختر شعورًا آخر' }
  },

  /* Opening verse on the welcome screen */
  intro: {
    type: 'ayah',
    en: 'Those who have faith and whose hearts find peace in the remembrance of Allah. Truly, it is in the remembrance of Allah that hearts find peace.',
    ar: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    ref: { en: 'Surah Ar-Ra’d', ar: 'سورة الرعد', ayah: 28 }
  },

  feelings: [
    {
      id: 'happy', label: { en: 'Happy', ar: 'سعيد' },
      texts: [{
        type: 'dua',
        en: 'O Allah, I seek Your protection from the loss of Your favors, the removal of Your complete protection, Your sudden punishment and all that which may incur Your displeasure.',
        ar: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِن زَوَالِ نِعمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقمَتِكَ، وَجَمِيعِ سَخَطِكَ.'
      }]
    },
    {
      id: 'grateful', label: { en: 'Grateful', ar: 'ممتنّ' },
      texts: [{
        type: 'ayah',
        en: 'If you are grateful, I will certainly give you more.',
        ar: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
        ref: { en: 'Surah Ibrahim', ar: 'سورة إبراهيم', ayah: 7 }
      }, {
        type: 'ayah',
        en: 'My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do good deeds that please You. Make my offspring righteous; I truly repent to You, and truly I am of those who submit to You.',
        ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي ۖ إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ',
        /* The docx says Surah An-Naml, but this wording (with "make my offspring righteous") is Al-Ahqaf 46:15. */
        ref: { en: 'Surah Al-Ahqaf', ar: 'سورة الأحقاف', ayah: 15 }
      }]
    },
    {
      id: 'calm', label: { en: 'Calm', ar: 'هادئ' },
      texts: [{
        type: 'ayah',
        en: 'Those who have faith and whose hearts find peace in the remembrance of Allah. Truly, it is in the remembrance of Allah that hearts find peace.',
        /* The docx Arabic also appended part of Ghafir 40:44; kept to Ar-Ra'd 28 to match the English and the reference. */
        ar: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        ref: { en: 'Surah Ar-Ra’d', ar: 'سورة الرعد', ayah: 28 }
      }]
    },
    {
      id: 'hopeful', label: { en: 'Hopeful', ar: 'متفائل' },
      texts: [{
        type: 'ayah',
        en: 'They rejoice in Allah’s grace and bounty, and that Allah does not discount the reward of the believers.',
        /* The docx Arabic also appended part of At-Tawbah 9:40; kept to Al 'Imran 171 to match the English and the reference. */
        ar: 'يَسْتَبْشِرُونَ بِنِعْمَةٍ مِنَ اللَّهِ وَفَضْلٍ وَأَنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُؤْمِنِينَ',
        ref: { en: 'Surah Ali ’Imran', ar: 'سورة آل عمران', ayah: 171 }
      }]
    },
    {
      id: 'anxious', label: { en: 'Anxious', ar: 'قلِق' },
      texts: [{
        type: 'dua',
        en: 'Allah is sufficient for me. There is no god worthy of worship except Him. I have placed my trust in Him only and He is the Lord of the Magnificent Throne.',
        ar: 'حَسبِيَ اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ، عَلَيهِ تَوَكَّلتُ، وَهُوَ رَبُّ العَرشِ العَظِيم.'
      }]
    },
    {
      id: 'sad', label: { en: 'Sad', ar: 'حزين' },
      texts: [{
        type: 'dua',
        en: 'O Allah, I seek Your protection from anxiety and grief. I seek Your protection from inability and laziness. I seek Your protection from cowardice and miserliness, and I seek Your protection from being overcome by debt and being overpowered by men.',
        ar: 'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الهَمِّ وَالحَزَنِ، وَأَعُوذُ بِكَ مِنَ العَجزِ وَالكَسَلِ، وَأَعُوذُ بِكَ مِنَ الجُبنِ وَالبُخلِ، وَأَعُوذُ بِكَ مِن غَلَبَةِ الدَّينِ وَقَهرِ الرِّجَالِ.'
      }]
    },
    {
      id: 'overwhelmed', label: { en: 'Overwhelmed', ar: 'مُثقَل' },
      texts: [{
        type: 'dua',
        en: 'O Allah, I ask You for well-being in this world and the next. O Allah, I ask You for forgiveness and well-being in my religion, in my worldly affairs, in my family and in my wealth. O Allah, conceal my faults and calm my fears. O Allah, guard me from in front of me and behind me, from my right, and from my left, and from above me. I seek protection in Your Greatness from being unexpectedly destroyed from beneath me.',
        ar: 'اللّٰهُمَّ إِنِّي أَسأَلُكَ العَافِيَةَ فِي الدُّنيَا وَالآخِرَةِ، اَللّٰهُمَّ إِنِّي أَسأَلُكَ العَفوَ وَالعَافِيَةَ فِي دِينِي وَدُنيَايَ وَأَهلِي وَمَالِي، اَللّٰهُمَّ استُر عَورَاتِي وَآمِن رَوعَاتِي، اَللّٰهُمَّ احفَظنِي مِن بَينِ يَدَيَّ، وَمِن خَلفِي، وَعَن يَّمِينِي، وَعَن شِمَالِي، وَمِن فَوقِي، وَأَعُوذُ بِعَظَمَتِكَ أَن أُغتَالَ مِن تَحتِي.'
      }]
    },
    {
      id: 'confused', label: { en: 'Confused', ar: 'حائر' },
      texts: [{
        type: 'dua',
        en: 'O Allah, I beg You for steadfastness in all matters and the determination to take the right course. I ask You for all that which will necessitate Your mercy and the determination to do all that which will necessitate Your forgiveness. I ask You to make me grateful for Your blessings and to worship You in an excellent manner. I ask You for a sound heart and a truthful tongue. I ask You for the good of what You know, I seek Your protection from the evil of what You know, and I seek Your forgiveness for what You know. Indeed, You are the All-Knowing of the unseen.',
        ar: 'اللّٰهُمَّ إِنِّي أَسأَلُكَ الثَّبَاتَ فِي الأَمرِ، وَالعَزِيمَةَ عَلَى الرُّشدِ، وَأَسأَلُكَ مُوجِبَاتِ رَحمَتِكَ، وَعَزَائِمَ مَغفِرَتِكَ، وَأَسأَلُكَ شُكرَ نِعمَتِكَ، وَحُسنَ عِبَادَتِكَ، وَأَسأَلُكَ قَلبًا سَلِيمًا، وَلِسَانًا صَادِقًا، وَأَسأَلُكَ مِن خَيرِ مَا تَعلَمُ، وَأَعُوذُ بِكَ مِن شَرِّ مَا تَعلَمُ، وَأَستَغفِرُكَ لِمَا تَعلَمُ، إِنَّكَ أَنتَ عَلَّامُ الغُيُوبِ.'
      }]
    }
  ]
};
