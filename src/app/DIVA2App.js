"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════
//  DATA — DIVA 2.0 (Kooij & Francken, 2010)
// ═══════════════════════════════════════════════════

const INATTENTION_ITEMS = [
  {
    id: "A1",
    question:
      "Avez-vous souvent du mal à prêter attention aux détails, ou faites-vous souvent des erreurs d'étourderie dans votre travail ou dans d'autres activités ?",
    adult: [
      "Fait des erreurs d'étourderie",
      "Travaille lentement pour éviter les erreurs",
      "Ne lit pas les instructions avec soin",
      "Du mal à travailler de façon minutieuse",
      "Besoin de trop de temps pour mener à leur terme des tâches complexes",
      "Facilement empêtré par les détails",
      "Travaille trop rapidement et commet ainsi des erreurs",
    ],
    child: [
      "Erreurs d'étourderie lors du travail scolaire",
      "Erreurs parce qu'il ne lisait pas les questions correctement",
      "Ne répondait pas à des questions parce qu'il ne les lisait pas correctement",
      "Ne répondait pas aux questions posées au verso d'un examen",
      "Les autres faisaient remarquer que le travail n'était pas soigné",
      "Ne vérifiait pas ses réponses dans les devoirs scolaires",
      "Besoin de trop de temps pour mener à leur terme des tâches minutieuses",
    ],
  },
  {
    id: "A2",
    question:
      "Trouvez-vous souvent difficile de soutenir votre attention sur une tâche ?",
    adult: [
      "Incapable de maintenir son attention sur des tâches pendant longtemps",
      "Facilement distrait par ses propres pensées ou associations d'idées",
      "Difficile de suivre un film jusqu'à la fin, ou de lire un livre",
      "Rapidement ennuyé par les choses",
      "Pose des questions sur des sujets déjà discutés",
    ],
    child: [
      "Du mal à maintenir l'attention lors du travail scolaire",
      "Du mal à maintenir l'attention sur un jeu",
      "Facilement distrait",
      "Du mal à se concentrer",
      "Besoin d'un environnement structuré pour ne pas être distrait",
      "Rapidement ennuyé dans des activités",
    ],
  },
  {
    id: "A3",
    question:
      "Donnez-vous souvent l'impression de ne pas écouter lorsqu'on vous parle directement ?",
    adult: [
      "Rêveur ou préoccupé",
      "Du mal à se concentrer pendant une conversation",
      "Après-coup, ne se rappelle pas du sujet d'une conversation",
      "Change souvent de sujet dans une conversation",
      "D'autres personnes vous disent que vos pensées sont ailleurs",
    ],
    child: [
      "Ne sait plus ce que les parents/enseignants ont dit",
      "Rêveur ou préoccupé",
      "N'écoute qu'avec un contact visuel ou lorsque le ton est élevé",
      "Doit souvent être interpelé",
      "Les questions doivent être répétées",
    ],
  },
  {
    id: "A4",
    question:
      "Avez-vous souvent du mal à vous conformer aux consignes et à mener à terme vos tâches domestiques ou vos obligations professionnelles ?",
    adult: [
      "Fait plusieurs tâches en même temps sans les terminer",
      "Du mal à finir les tâches une fois que la nouveauté a diminué",
      "Besoin de fixer un délai pour terminer les tâches",
      "Du mal à terminer les tâches administratives",
      "Du mal à suivre les instructions dans un manuel",
    ],
    child: [
      "Du mal à suivre les instructions",
      "En difficulté lorsque les tâches comprennent plusieurs étapes successives",
      "Ne termine pas les choses",
      "Ne termine pas les devoirs ou ne les rend pas",
      "Besoin d'un environnement structuré pour pouvoir terminer les tâches",
    ],
  },
  {
    id: "A5",
    question:
      "Trouvez-vous souvent difficile d'organiser les tâches ou les activités ?",
    adult: [
      "Du mal à planifier les activités de la vie quotidienne",
      "La maison ou l'espace de travail est en désordre",
      "Planifie trop de tâches ou planification inefficace",
      "Prévoit régulièrement de faire plusieurs choses au même moment",
      "Arrive en retard",
      "Incapable d'utiliser un agenda de manière efficace",
      "Rigide par nécessité de coller au programme",
      "Faible conscience du temps",
      "Établit des listes sans les utiliser",
      "Besoin qu'un tiers structure les choses",
    ],
    child: [
      "Du mal à être prêt à temps",
      "Chambre ou bureau en désordre",
      "Du mal à jouer seul",
      "Du mal à planifier des tâches ou ses devoirs",
      "Fait les choses de manière confuse",
      "Arrive en retard",
      "Faible conscience du temps",
      "Du mal à s'occuper seul",
    ],
  },
  {
    id: "A6",
    question:
      "Évitez-vous souvent les tâches qui nécessitent un effort mental soutenu ?",
    adult: [
      "Fait en premier les choses les plus faciles ou les plus agréables",
      "Remet à plus tard les tâches ennuyeuses ou difficiles",
      "Remet à plus tard les choses jusqu'à dépasser les délais",
      "Évite les tâches monotones, comme les tâches administratives",
      "N'aime pas lire à cause de l'effort mental",
      "Évite des tâches qui demandent beaucoup de concentration",
    ],
    child: [
      "Évite des devoirs ou aversion pour les devoirs",
      "Lit peu de livres ou n'aime pas lire à cause de l'effort mental",
      "Évite des tâches qui demandent beaucoup de concentration",
      "Déteste les sujets scolaires qui demandent beaucoup de concentration",
      "Remet à plus tard les tâches ennuyeuses ou difficiles",
    ],
  },
  {
    id: "A7",
    question:
      "Perdez-vous souvent les objets nécessaires à votre travail ou vos activités ?",
    adult: [
      "Égare portefeuille, clés, ou agenda",
      "Oublie des choses en quittant un lieu",
      "Perd des papiers pour son travail",
      "Perd beaucoup de temps à chercher des choses",
      "Panique si des gens ont changé des choses de place",
      "Range les choses au mauvais endroit",
      "Perd des notes, listes ou numéros de téléphone",
    ],
    child: [
      "Perd l'agenda, les stylos, les affaires de gymnastique ou d'autres choses",
      "Égare des jouets, habits ou devoirs scolaires",
      "Perd beaucoup de temps à chercher des choses",
      "Panique si des gens ont changé des choses de place",
      "Les parents et/ou les enseignants font remarquer qu'il a perdu des choses",
    ],
  },
  {
    id: "A8",
    question:
      "Vous laissez-vous facilement distraire par des stimuli externes ?",
    adult: [
      "Du mal à ignorer des stimuli externes",
      "Du mal à reprendre les choses après avoir été distrait",
      "Facilement distrait par des bruits ou des événements",
      "Facilement distrait par une conversation entre d'autres personnes",
      "Du mal à filtrer et/ou sélectionner des informations",
    ],
    child: [
      "En classe, il regarde souvent dehors",
      "Facilement distrait par des bruits ou des événements",
      "Du mal à reprendre les choses après avoir été distrait",
    ],
  },
  {
    id: "A9",
    question: "Avez-vous des oublis fréquents dans la vie quotidienne ?",
    adult: [
      "Oublie des rendez-vous ou des obligations",
      "Oublie les clés, l'agenda, etc.",
      "A besoin de rappels fréquents concernant les rendez-vous",
      "Retourne sur ses pas pour prendre des choses oubliées",
      "Utilise des programmes rigides pour être sûr de ne rien oublier",
      "Ne tient pas à jour son agenda et/ou oublie de consulter son agenda",
    ],
    child: [
      "Oublie des rendez-vous ou des consignes",
      "On doit souvent lui rappeler les choses",
      "S'arrête en chemin parce qu'il a oublié ce qu'il devait faire",
      "Oublie d'apporter des affaires scolaires",
      "Oublie des choses à l'école ou chez des amis",
    ],
  },
];

const HYPERACTIVITY_ITEMS = [
  {
    id: "HI1",
    question:
      "Remuez-vous souvent les mains ou les pieds, ou vous tortillez-vous souvent sur votre siège ?",
    adult: [
      "Du mal à rester assis immobile",
      "Remue les jambes",
      "Tape avec un stylo ou joue avec un objet",
      "Tortille les cheveux ou ronge les ongles",
      "Capable de contrôler l'agitation mais cela vous stresse",
    ],
    child: [
      "Les parents disent souvent « tiens-toi tranquille »",
      "Remue les jambes",
      "Tape avec un stylo ou joue avec un objet",
      "Tortille les cheveux ou ronge les ongles",
      "Incapable de rester assis de façon relaxée",
      "Capable de contrôler l'agitation mais cela vous stressait",
    ],
  },
  {
    id: "HI2",
    question:
      "Vous levez-vous souvent dans des situations où vous êtes supposé rester assis ?",
    adult: [
      "Évite les réunions, les conférences, les cérémonies religieuses, etc.",
      "Préfère marcher plutôt que rester assis",
      "Ne reste jamais longtemps assis tranquille, bouge sans cesse",
      "Stressé par l'obligation de rester assis",
      "Trouve une excuse pour pouvoir marcher",
    ],
    child: [
      "Se lève souvent pendant les repas ou en classe",
      "Trouve très difficile de rester assis en classe ou pendant les repas",
      "On lui dit souvent de rester assis",
      "Trouve une excuse pour pouvoir marcher",
    ],
  },
  {
    id: "HI3",
    question: "Vous sentez-vous souvent agité(e) ?",
    adult: [
      "Se sent agité ou nerveux à l'intérieur",
      "Ressent constamment le sentiment d'avoir quelque chose à faire",
      "Trouve difficile de se relaxer",
    ],
    child: [
      "Court toujours",
      "Grimpe sur les meubles ou saute sur les fauteuils",
      "Monte aux arbres",
      "Se sent agité à l'intérieur",
    ],
  },
  {
    id: "HI4",
    question:
      "Trouvez-vous souvent difficile de profiter d'un moment de détente ?",
    adult: [
      "Parle lorsque cela n'est pas approprié",
      "Se met rapidement en avant en public",
      "Bruyant dans tout type de situations",
      "Du mal à faire des activités tranquillement",
      "Du mal à parler doucement",
    ],
    child: [
      "Fait du bruit en jouant ou en classe",
      "Incapable de regarder la TV ou un film tranquillement",
      "On lui demande souvent de se calmer ou d'être plus tranquille",
      "Se met rapidement en avant en public",
    ],
  },
  {
    id: "HI5",
    question:
      'Êtes-vous souvent « sur la brèche » ou comme si vous étiez « dirigé(e) par un moteur » ?',
    adult: [
      "Toujours occupé à faire quelque chose",
      "Déborde d'énergie, toujours en mouvement",
      "Franchit ses propres limites",
      "Lâche difficilement prise, excessivement insistant",
    ],
    child: [
      "Constamment occupé",
      "Remarqué par son activité en classe ou à la maison",
      "Déborde d'énergie",
      "Toujours sur la brèche, monté sur ressorts",
    ],
  },
  {
    id: "HI6",
    question: "Parlez-vous souvent trop ?",
    adult: [
      "Parle tellement que les gens trouvent cela fatiguant",
      "Connu pour parler de manière incessante",
      "Trouve difficile d'arrêter de parler",
      "Tendance à trop parler",
      "Ne laisse pas l'occasion aux autres d'intervenir dans une conversation",
      "Besoin de beaucoup de mots pour dire quelque chose",
    ],
    child: [
      "Connu comme une « boîte à paroles »",
      "Les enfants ou les enseignants demandent souvent le silence",
      "Les fiches scolaires mentionnent souvent des bavardages",
      "Puni pour avoir trop parlé",
      "Gêne le travail scolaire des autres en parlant trop",
      "Ne laisse pas les autres parler dans une conversation",
    ],
  },
  {
    id: "HI7",
    question:
      "Laissez-vous souvent échapper la réponse à une question qui n'est pas encore entièrement posée ?",
    adult: [
      "Dit ce qu'il pense",
      "Dit les choses sans réfléchir",
      "Donne des réponses avant que les gens aient fini de parler",
      "Finit les phrases des autres",
      "Manque de tact",
    ],
    child: [
      "Dit les choses sans réfléchir",
      "Veut être le premier à répondre aux questions en classe",
      "Donne la première réponse qui lui vient à l'esprit",
      "Interrompt les autres avant que les phrases soient finies",
      "Blesse verbalement (manque de tact)",
    ],
  },
  {
    id: "HI8",
    question: "Trouvez-vous souvent difficile d'attendre votre tour ?",
    adult: [
      "Difficulté à attendre dans une file, veut doubler",
      "Du mal à attendre patiemment dans la circulation",
      "Du mal à attendre son tour dans les conversations",
      "Impatient",
      "Rapidement commence ou met terme à des relations ou des emplois par impatience",
    ],
    child: [
      "Du mal à attendre son tour dans les sports ou les jeux",
      "Du mal à attendre son tour en classe",
      "Toujours le premier à parler ou agir",
      "Rapidement impatient",
      "Traverse la route sans regarder",
    ],
  },
  {
    id: "HI9",
    question:
      "Interrompez-vous souvent les autres ou imposez-vous votre présence ?",
    adult: [
      "Rapide à interférer avec les autres",
      "Interrompt les autres",
      "Dérange sans qu'on lui ait rien demandé",
      "Les autres font remarquer qu'il est intrusif",
      "Du mal à respecter les limites des autres",
      "A une opinion sur tout et la donne immédiatement",
    ],
    child: [
      "S'immisce dans les jeux des autres",
      "Interrompt les conversations des autres",
      "Réagit sur tout",
      "Incapable d'attendre",
    ],
  },
];

const IMPAIRMENT_DOMAINS = {
  adult: {
    work: {
      label: "Travail / Éducation",
      items: [
        "N'a pas atteint le niveau d'étude pour le travail voulu",
        "Travaille en deçà du niveau d'étude",
        "Rapidement fatigué d'un lieu de travail",
        "Succession de plusieurs emplois à court terme",
        "Difficulté avec le travail administratif/la planification",
        "N'obtient pas de promotions",
        "Sous-performant au travail",
        "A quitté un emploi ou a été renvoyé après une dispute",
        "Arrêts de travail ou invalidité liés aux symptômes",
        "Retentissement limité par compensation par un fort niveau intellectuel",
        "Retentissement limité par compensation par la structure externe",
      ],
    },
    relationships: {
      label: "Relations et/ou Famille",
      items: [
        "Rapidement fatigué par les relations",
        "Débute/termine impulsivement les relations",
        "Compensation nécessaire des symptômes par le conjoint",
        "Problèmes relationnels, nombreuses disputes, manque d'intimité",
        "Divorce à cause des symptômes",
        "Problèmes sexuels à cause des symptômes",
        "Problèmes avec l'éducation à cause des symptômes",
        "Difficultés ménagères et/ou administratives",
        "Problèmes financiers ou jeux d'argent",
        "N'ose pas commencer une relation",
      ],
    },
    social: {
      label: "Contacts sociaux",
      items: [
        "Rapidement fatigué par les contacts sociaux",
        "Difficulté à maintenir des contacts sociaux",
        "Conflits résultant de problèmes de communication",
        "Difficulté à initier des contacts sociaux",
        "Faible auto-affirmation de soi",
        "Inattention (oubli d'envoyer une carte, d'être empathique, etc.)",
      ],
    },
    leisure: {
      label: "Temps libre / Hobby",
      items: [
        "Incapable de se relaxer complètement pendant le temps libre",
        "Obligé de pratiquer beaucoup de sport pour se relaxer",
        "Blessures à la suite d'une pratique excessive du sport",
        "Incapable de terminer un livre ou de regarder un film jusqu'au bout",
        "Fatigué parce qu'affairé en permanence",
        "Rapidement lassé par les hobbies",
        "Accidents ou suspension de permis de conduire",
        "Recherche de sensations et/ou prise trop fréquente de risques",
        "Problèmes avec la police/la justice",
        "Hyperphagie",
      ],
    },
    selfImage: {
      label: "Confiance en soi / Image de soi",
      items: [
        "Doute de lui-même suite aux remarques négatives des autres",
        "Image de soi négative à cause des échecs du passé",
        "Peur de l'échec en commençant de nouvelles choses",
        "Réaction excessive aux critiques",
        "Perfectionnisme",
        "Affecté par les symptômes du TDAH",
      ],
    },
  },
  child: {
    education: {
      label: "Éducation",
      items: [
        "Niveau d'études inférieur à celui prédit par le QI",
        "Redoublement à cause de problèmes de concentration",
        "Études inachevées / Renvoi d'un établissement scolaire",
        "Plus d'années pour terminer les études que nécessaire",
        "A obtenu un niveau d'étude conforme au QI mais avec beaucoup de difficultés",
        "Difficulté à faire les devoirs",
        "Éducation spéciale à cause des symptômes",
        "Commentaires des enseignants sur le comportement ou la concentration",
        "Retentissement limité par compensation par un fort niveau intellectuel",
        "Retentissement limité par compensation par la structure externe",
      ],
    },
    family: {
      label: "Famille",
      items: [
        "Disputes fréquentes avec frères et sœurs",
        "Punitions ou corrections fréquentes",
        "Peu de contacts avec la famille à cause des conflits",
        "A nécessité le soutien des parents pour une période plus longue que la normale",
      ],
    },
    social: {
      label: "Contacts sociaux",
      items: [
        "Difficulté à maintenir des contacts sociaux",
        "Conflits résultant de problèmes de communication",
        "Difficulté à initier des contacts sociaux",
        "Faible auto-affirmation de soi",
        "Peu d'amis",
        "Taquiné par les autres",
        "Exclu du groupe ou n'est pas invité à participer aux activités",
        "Joue les petits durs",
      ],
    },
    leisure: {
      label: "Temps libre / Hobby",
      items: [
        "Incapable de se relaxer correctement pendant le temps libre",
        "Obligé de pratiquer beaucoup de sport pour se relaxer",
        "Blessures à la suite d'une pratique excessive du sport",
        "Incapable de terminer un livre ou de regarder un film jusqu'au bout",
        "Fatigué parce qu'affairé en permanence",
        "Rapidement lassé par les hobbies",
        "Recherche de sensations et/ou prise trop fréquente de risques",
        "Problèmes avec la police/la justice",
        "Nombre augmenté d'accidents",
      ],
    },
    selfImage: {
      label: "Confiance en soi / Image de soi",
      items: [
        "Doute de lui-même suite aux remarques négatives des autres",
        "Image de soi négative à cause des échecs du passé",
        "Peur de l'échec avant de démarrer de nouvelles choses",
        "Réaction excessive aux critiques",
        "Perfectionnisme",
      ],
    },
  },
};

// ═══════════════════════════════════════════════════
//  STORAGE — localStorage
// ═══════════════════════════════════════════════════

const STORAGE_KEY = "diva2-session";

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("localStorage save error:", e);
  }
}

// ═══════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: checked ? "rgba(99,102,241,0.08)" : "transparent",
        transition: "background 0.2s",
        fontSize: 14,
        lineHeight: 1.5,
        userSelect: "none",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          minWidth: 20,
          borderRadius: 5,
          border: checked ? "2px solid #6366f1" : "2px solid #c7c7cc",
          background: checked ? "#6366f1" : "#fff",
          marginTop: 1,
          transition: "all 0.15s",
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span style={{ color: "#1d1d1f" }}>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
      />
    </label>
  );
}

function SymptomToggle({ value, onChange, label }) {
  const isYes = value === true;
  const isNo = value === false;
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}
    >
      <span style={{ fontSize: 13, color: "#6b7280", marginRight: 4 }}>
        {label}
      </span>
      <button
        onClick={() => onChange(true)}
        style={{
          padding: "5px 16px",
          borderRadius: 20,
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          background: isYes ? "#22c55e" : "#f3f4f6",
          color: isYes ? "#fff" : "#6b7280",
          transition: "all 0.15s",
        }}
      >
        Oui
      </button>
      <button
        onClick={() => onChange(false)}
        style={{
          padding: "5px 16px",
          borderRadius: 20,
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          background: isNo ? "#ef4444" : "#f3f4f6",
          color: isNo ? "#fff" : "#6b7280",
          transition: "all 0.15s",
        }}
      >
        Non
      </button>
    </div>
  );
}

function SymptomCard({
  item,
  adultChecked,
  childChecked,
  adultPresent,
  childPresent,
  onToggleAdult,
  onToggleChild,
  onSetAdultPresent,
  onSetChildPresent,
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        marginBottom: 14,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 12,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              minWidth: 34,
              borderRadius: 10,
              background:
                adultPresent === true && childPresent === true
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : adultPresent === true || childPresent === true
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : adultPresent === false && childPresent === false
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #e5e7eb, #d1d5db)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              fontFamily: "'SF Mono', 'Fira Code', monospace",
            }}
          >
            {item.id}
          </span>
          <span
            style={{
              fontSize: 14,
              color: "#1d1d1f",
              lineHeight: 1.45,
              fontWeight: 500,
            }}
          >
            {item.question}
          </span>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            minWidth: 20,
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: "0 18px 18px" }}>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#6366f1",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#6366f1",
                }}
              />
              Âge adulte
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {item.adult.map((ex, i) => (
                <CheckboxItem
                  key={i}
                  label={ex}
                  checked={adultChecked[i] || false}
                  onChange={() => onToggleAdult(i)}
                />
              ))}
            </div>
            <SymptomToggle
              value={adultPresent}
              onChange={onSetAdultPresent}
              label="Symptôme présent :"
            />
          </div>

          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#f59e0b",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f59e0b",
                }}
              />
              Enfance (5–12 ans)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {item.child.map((ex, i) => (
                <CheckboxItem
                  key={i}
                  label={ex}
                  checked={childChecked[i] || false}
                  onChange={() => onToggleChild(i)}
                />
              ))}
            </div>
            <SymptomToggle
              value={childPresent}
              onChange={onSetChildPresent}
              label="Symptôme présent :"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ImpairmentDomain({ domain, checked, onToggle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
          marginBottom: 6,
          paddingBottom: 4,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {domain.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {domain.items.map((item, i) => (
          <CheckboxItem
            key={i}
            label={item}
            checked={checked[i] || false}
            onChange={() => onToggle(i)}
          />
        ))}
      </div>
    </div>
  );
}

function ScoreBadge({ value, max, label }) {
  const pct = max > 0 ? value / max : 0;
  const color = value >= 6 ? "#22c55e" : value >= 4 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: `4px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 6px",
          background: `conic-gradient(${color} ${pct * 360}deg, #f3f4f6 0deg)`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 20,
            color,
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}
        >
          {value}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 10, color: "#9ca3af" }}>/ {max}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════

const SECTION_LABELS = ["Symptômes", "Retentissement", "Résultats"];

function getDefaultState() {
  return {
    inattention: INATTENTION_ITEMS.map((item) => ({
      adultChecked: new Array(item.adult.length).fill(false),
      childChecked: new Array(item.child.length).fill(false),
      adultPresent: null,
      childPresent: null,
    })),
    hyperactivity: HYPERACTIVITY_ITEMS.map((item) => ({
      adultChecked: new Array(item.adult.length).fill(false),
      childChecked: new Array(item.child.length).fill(false),
      adultPresent: null,
      childPresent: null,
    })),
    impairmentAdult: Object.fromEntries(
      Object.keys(IMPAIRMENT_DOMAINS.adult).map((k) => [
        k,
        new Array(IMPAIRMENT_DOMAINS.adult[k].items.length).fill(false),
      ])
    ),
    impairmentChild: Object.fromEntries(
      Object.keys(IMPAIRMENT_DOMAINS.child).map((k) => [
        k,
        new Array(IMPAIRMENT_DOMAINS.child[k].items.length).fill(false),
      ])
    ),
    onsetBefore7: null,
    onsetAge: "",
    criterionE: null,
    criterionEDetail: "",
  };
}

export default function DIVA2App() {
  const [state, setState] = useState(getDefaultState);
  const [section, setSection] = useState(0);
  const [subSection, setSubSection] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const topRef = useRef(null);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const saved = loadState();
    if (saved) setState(saved);
    setHydrated(true);
  }, []);

  // Persist every change (debounced-ish via effect)
  useEffect(() => {
    if (hydrated) persistState(state);
  }, [state, hydrated]);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [section, subSection]);

  const updateSymptom = useCallback((category, idx, field, value) => {
    setState((prev) => {
      const next = { ...prev };
      next[category] = [...prev[category]];
      next[category][idx] = { ...prev[category][idx], [field]: value };
      return next;
    });
  }, []);

  const toggleExampleCheck = useCallback((category, idx, ageField, exIdx) => {
    setState((prev) => {
      const next = { ...prev };
      next[category] = [...prev[category]];
      const arr = [...prev[category][idx][ageField]];
      arr[exIdx] = !arr[exIdx];
      next[category][idx] = { ...prev[category][idx], [ageField]: arr };
      return next;
    });
  }, []);

  const toggleImpairment = useCallback((age, domain, idx) => {
    setState((prev) => {
      const key = age === "adult" ? "impairmentAdult" : "impairmentChild";
      const next = { ...prev };
      next[key] = { ...prev[key] };
      const arr = [...prev[key][domain]];
      arr[idx] = !arr[idx];
      next[key][domain] = arr;
      return next;
    });
  }, []);

  // Scoring
  const aAdult = state.inattention.filter((s) => s.adultPresent === true).length;
  const aChild = state.inattention.filter((s) => s.childPresent === true).length;
  const hiAdult = state.hyperactivity.filter((s) => s.adultPresent === true).length;
  const hiChild = state.hyperactivity.filter((s) => s.childPresent === true).length;

  const adultImpairmentDomains = Object.values(state.impairmentAdult).filter(
    (arr) => arr.some(Boolean)
  ).length;
  const childImpairmentDomains = Object.values(state.impairmentChild).filter(
    (arr) => arr.some(Boolean)
  ).length;

  const aCriterionMet = aAdult >= 6 && aChild >= 6;
  const hiCriterionMet = hiAdult >= 6 && hiChild >= 6;
  const impairmentMet = adultImpairmentDomains >= 2 && childImpairmentDomains >= 2;
  const onsetMet =
    state.onsetBefore7 === true ||
    (state.onsetBefore7 === false && state.onsetAge !== "");
  const notBetterExplained = state.criterionE === false;

  let diagnosis = null;
  if (aCriterionMet && hiCriterionMet && impairmentMet && notBetterExplained) {
    diagnosis = { code: "314.01", label: "Type combiné" };
  } else if (
    aCriterionMet &&
    !hiCriterionMet &&
    impairmentMet &&
    notBetterExplained
  ) {
    diagnosis = { code: "314.00", label: "Type inattentif prédominant" };
  } else if (
    !aCriterionMet &&
    hiCriterionMet &&
    impairmentMet &&
    notBetterExplained
  ) {
    diagnosis = { code: "314.01", label: "Type hyperactif/impulsif prédominant" };
  }

  const handleReset = () => {
    if (confirm("Réinitialiser toutes les réponses ? Cette action est irréversible.")) {
      setState(getDefaultState());
      setSection(0);
      setSubSection(0);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  if (!hydrated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          Chargement…
        </div>
      </div>
    );
  }

  const symptomItems =
    subSection === 0 ? INATTENTION_ITEMS : HYPERACTIVITY_ITEMS;
  const symptomCategory = subSection === 0 ? "inattention" : "hyperactivity";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f1f5 0%, #e8eaf0 100%)",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        paddingBottom: 100,
      }}
    >
      <div ref={topRef} />

      {/* ── Header ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          padding: "32px 20px 24px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
          DIVA 2.0
        </div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4, lineHeight: 1.4 }}>
          Entretien diagnostique pour le TDAH chez l'adulte
        </div>
        <div style={{ fontSize: 10, opacity: 0.4, marginTop: 8 }}>
          Kooij & Francken, 2010 — DIVA Foundation
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          {[
            { label: "A adulte", v: aAdult, ok: aAdult >= 6 },
            { label: "A enfance", v: aChild, ok: aChild >= 6 },
            { label: "H/I adulte", v: hiAdult, ok: hiAdult >= 6 },
            { label: "H/I enfance", v: hiChild, ok: hiChild >= 6 },
          ].map(({ label, v, ok }) => (
            <div
              key={label}
              style={{
                background: ok
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                {v}
              </span>
              <span style={{ opacity: 0.7, fontSize: 10 }}>/9</span>
              <span style={{ opacity: 0.8 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {SECTION_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => {
              setSection(i);
              if (i === 0) setSubSection(0);
            }}
            style={{
              flex: 1,
              padding: "14px 8px",
              background: "none",
              border: "none",
              borderBottom:
                section === i
                  ? "3px solid #6366f1"
                  : "3px solid transparent",
              color: section === i ? "#6366f1" : "#9ca3af",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 12px" }}>
        {/* ══ SECTION 0 — Symptoms ══ */}
        {section === 0 && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                "Inattention (A1–A9)",
                "Hyperactivité-Impulsivité (H/I 1–9)",
              ].map((label, i) => (
                <button
                  key={i}
                  onClick={() => setSubSection(i)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    background:
                      subSection === i
                        ? i === 0
                          ? "#6366f1"
                          : "#f59e0b"
                        : "#f3f4f6",
                    color: subSection === i ? "#fff" : "#6b7280",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 14,
                padding: "10px 14px",
                background: "#f9fafb",
                borderRadius: 10,
                lineHeight: 1.5,
              }}
            >
              Appuyez sur chaque critère pour l'ouvrir. Cochez les exemples
              reconnus, puis indiquez si le symptôme est présent (
              <strong>Oui</strong> / <strong>Non</strong>) pour l'âge adulte et
              l'enfance.
            </div>

            {symptomItems.map((item, idx) => (
              <SymptomCard
                key={item.id}
                item={item}
                adultChecked={state[symptomCategory][idx].adultChecked}
                childChecked={state[symptomCategory][idx].childChecked}
                adultPresent={state[symptomCategory][idx].adultPresent}
                childPresent={state[symptomCategory][idx].childPresent}
                onToggleAdult={(exIdx) =>
                  toggleExampleCheck(symptomCategory, idx, "adultChecked", exIdx)
                }
                onToggleChild={(exIdx) =>
                  toggleExampleCheck(symptomCategory, idx, "childChecked", exIdx)
                }
                onSetAdultPresent={(v) =>
                  updateSymptom(symptomCategory, idx, "adultPresent", v)
                }
                onSetChildPresent={(v) =>
                  updateSymptom(symptomCategory, idx, "childPresent", v)
                }
              />
            ))}
          </>
        )}

        {/* ══ SECTION 1 — Impairment ══ */}
        {section === 1 && (
          <>
            {/* Criterion B */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 18,
                marginBottom: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1e1b4b",
                  marginBottom: 12,
                }}
              >
                Critère B — Âge de début
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#374151",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                Avez-vous toujours eu ces symptômes ? Quelques symptômes
                étaient-ils présents avant l'âge de 7 ans ?
              </div>
              <SymptomToggle
                value={state.onsetBefore7}
                onChange={(v) =>
                  setState((p) => ({ ...p, onsetBefore7: v }))
                }
                label="Avant 7 ans :"
              />
              {state.onsetBefore7 === false && (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    Âge de début :
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={state.onsetAge}
                    onChange={(e) =>
                      setState((p) => ({ ...p, onsetAge: e.target.value }))
                    }
                    style={{
                      width: 60,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#6b7280" }}>ans</span>
                </div>
              )}
            </div>

            {/* Adult impairment */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 18,
                marginBottom: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#6366f1",
                  marginBottom: 4,
                }}
              >
                Critère C — Retentissement à l'âge adulte
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: adultImpairmentDomains >= 2 ? "#22c55e" : "#9ca3af",
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                {adultImpairmentDomains}/5 domaines atteints (≥ 2 requis)
              </div>
              {Object.entries(IMPAIRMENT_DOMAINS.adult).map(([key, domain]) => (
                <ImpairmentDomain
                  key={key}
                  domain={domain}
                  checked={state.impairmentAdult[key]}
                  onToggle={(i) => toggleImpairment("adult", key, i)}
                />
              ))}
            </div>

            {/* Child impairment */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 18,
                marginBottom: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#f59e0b",
                  marginBottom: 4,
                }}
              >
                Critère C — Retentissement dans l'enfance
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: childImpairmentDomains >= 2 ? "#22c55e" : "#9ca3af",
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                {childImpairmentDomains}/5 domaines atteints (≥ 2 requis)
              </div>
              {Object.entries(IMPAIRMENT_DOMAINS.child).map(([key, domain]) => (
                <ImpairmentDomain
                  key={key}
                  domain={domain}
                  checked={state.impairmentChild[key]}
                  onToggle={(i) => toggleImpairment("child", key, i)}
                />
              ))}
            </div>

            {/* Criterion E */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 18,
                marginBottom: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1e1b4b",
                  marginBottom: 12,
                }}
              >
                Critère E — Diagnostic différentiel
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#374151",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                Les symptômes peuvent-ils être mieux expliqués par la présence
                d'un autre trouble psychiatrique ?
              </div>
              <SymptomToggle
                value={state.criterionE}
                onChange={(v) =>
                  setState((p) => ({ ...p, criterionE: v }))
                }
                label="Mieux expliqué :"
              />
              {state.criterionE === true && (
                <input
                  type="text"
                  placeholder="Précisez le trouble…"
                  value={state.criterionEDetail}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      criterionEDetail: e.target.value,
                    }))
                  }
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          </>
        )}

        {/* ══ SECTION 2 — Results ══ */}
        {section === 2 && (
          <>
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 24,
                marginBottom: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1e1b4b",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Résumé des symptômes
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: 24,
                }}
              >
                <ScoreBadge value={aAdult} max={9} label="A adulte" />
                <ScoreBadge value={aChild} max={9} label="A enfance" />
                <ScoreBadge value={hiAdult} max={9} label="H/I adulte" />
                <ScoreBadge value={hiChild} max={9} label="H/I enfance" />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          color: "#6b7280",
                        }}
                      >
                        Critère
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          color: "#6366f1",
                        }}
                      >
                        Adulte
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          color: "#f59e0b",
                        }}
                      >
                        Enfance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {INATTENTION_ITEMS.map((item, i) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "7px 6px", fontWeight: 600 }}>
                          {item.id}
                        </td>
                        <td style={{ textAlign: "center", padding: "7px 6px" }}>
                          {state.inattention[i].adultPresent === true
                            ? "✅"
                            : state.inattention[i].adultPresent === false
                            ? "—"
                            : "·"}
                        </td>
                        <td style={{ textAlign: "center", padding: "7px 6px" }}>
                          {state.inattention[i].childPresent === true
                            ? "✅"
                            : state.inattention[i].childPresent === false
                            ? "—"
                            : "·"}
                        </td>
                      </tr>
                    ))}
                    <tr
                      style={{
                        borderBottom: "2px solid #e5e7eb",
                        background: "#f9fafb",
                      }}
                    >
                      <td style={{ padding: "8px 6px", fontWeight: 700 }}>
                        Total A
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          fontWeight: 800,
                          color: aAdult >= 6 ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {aAdult}/9
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          fontWeight: 800,
                          color: aChild >= 6 ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {aChild}/9
                      </td>
                    </tr>
                    {HYPERACTIVITY_ITEMS.map((item, i) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "7px 6px", fontWeight: 600 }}>
                          {item.id}
                        </td>
                        <td style={{ textAlign: "center", padding: "7px 6px" }}>
                          {state.hyperactivity[i].adultPresent === true
                            ? "✅"
                            : state.hyperactivity[i].adultPresent === false
                            ? "—"
                            : "·"}
                        </td>
                        <td style={{ textAlign: "center", padding: "7px 6px" }}>
                          {state.hyperactivity[i].childPresent === true
                            ? "✅"
                            : state.hyperactivity[i].childPresent === false
                            ? "—"
                            : "·"}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#f9fafb" }}>
                      <td style={{ padding: "8px 6px", fontWeight: 700 }}>
                        Total H/I
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          fontWeight: 800,
                          color: hiAdult >= 6 ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {hiAdult}/9
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "8px 6px",
                          fontWeight: 800,
                          color: hiChild >= 6 ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {hiChild}/9
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Criteria checklist */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                marginBottom: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#1e1b4b",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Formulaire de cotation
              </div>

              {[
                {
                  label: "Critère A : ≥ 6 symptômes Inattention (adulte)",
                  met: aAdult >= 6,
                },
                {
                  label: "Critère A : ≥ 6 symptômes Inattention (enfance)",
                  met: aChild >= 6,
                },
                {
                  label: "Critère A : ≥ 6 symptômes H/I (adulte)",
                  met: hiAdult >= 6,
                },
                {
                  label: "Critère A : ≥ 6 symptômes H/I (enfance)",
                  met: hiChild >= 6,
                },
                {
                  label: "Critère B : Début avant 7 ans ou âge précisé",
                  met: onsetMet,
                },
                {
                  label:
                    "Critère C : Retentissement ≥ 2 domaines (adulte)",
                  met: adultImpairmentDomains >= 2,
                },
                {
                  label:
                    "Critère C : Retentissement ≥ 2 domaines (enfance)",
                  met: childImpairmentDomains >= 2,
                },
                {
                  label:
                    "Critère E : Non mieux expliqué par un autre trouble",
                  met: notBetterExplained,
                },
              ].map(({ label, met }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: i < 7 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: met ? "#22c55e" : "#f3f4f6",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {met ? "✓" : ""}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: met ? "#1d1d1f" : "#9ca3af",
                      fontWeight: met ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Diagnosis box */}
            <div
              style={{
                background: diagnosis
                  ? "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)"
                  : "#fff",
                borderRadius: 14,
                padding: 24,
                marginBottom: 16,
                border: diagnosis ? "none" : "1px solid #e5e7eb",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: diagnosis ? "rgba(255,255,255,0.5)" : "#9ca3af",
                  marginBottom: 12,
                }}
              >
                Diagnostic TDAH
              </div>

              {diagnosis ? (
                <>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 8,
                    }}
                  >
                    {diagnosis.label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "monospace",
                    }}
                  >
                    DSM-IV {diagnosis.code}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    {(aCriterionMet || hiCriterionMet) && !impairmentMet
                      ? "Critères symptomatiques atteints — compléter le retentissement"
                      : state.criterionE === true
                      ? "Symptômes mieux expliqués par un autre trouble"
                      : "Critères diagnostiques non remplis"}
                  </div>
                  <div
                    style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}
                  >
                    {!aCriterionMet && !hiCriterionMet
                      ? "Le seuil de 6 symptômes n'est pas atteint dans aucun domaine pour les deux âges de vie."
                      : !impairmentMet
                      ? "Complétez la section Retentissement pour valider les critères C et D."
                      : state.criterionE === null
                      ? "Complétez le critère E (diagnostic différentiel)."
                      : ""}
                  </div>
                </>
              )}
            </div>

            {/* Disclaimer */}
            <div
              style={{
                padding: "14px 16px",
                background: "#fef9ee",
                borderRadius: 10,
                fontSize: 11,
                color: "#92400e",
                lineHeight: 1.5,
                marginBottom: 16,
                border: "1px solid #fde68a",
              }}
            >
              ⚠️ Cet outil est une aide à la passation de la DIVA 2.0 et ne
              remplace pas le jugement clinique d'un professionnel de santé
              qualifié. Le diagnostic de TDAH doit être posé par un clinicien
              formé, en prenant en compte l'ensemble du tableau clinique.
            </div>

            <button
              onClick={handleReset}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "1px solid #fecaca",
                background: "#fff",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Réinitialiser tout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
