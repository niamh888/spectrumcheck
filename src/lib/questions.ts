import type { Domain, DomainKey, Question } from '@/types'

export const DOMAINS: Domain[] = [
  {
    key: 'social_communication',
    label: 'Social Communication',
    description: 'Understanding and navigating social interactions',
    color: '#6366f1',
  },
  {
    key: 'restricted_interests',
    label: 'Focused Interests',
    description: 'Intensity and range of interests and activities',
    color: '#8b5cf6',
  },
  {
    key: 'sensory',
    label: 'Sensory Sensitivity',
    description: 'Responses to sounds, textures, lights, and other sensations',
    color: '#ec4899',
  },
  {
    key: 'routines',
    label: 'Routines & Flexibility',
    description: 'Need for sameness and response to change',
    color: '#f59e0b',
  },
  {
    key: 'communication_style',
    label: 'Communication Style',
    description: 'How language is used and understood',
    color: '#10b981',
  },
  {
    key: 'emotional_regulation',
    label: 'Emotional Regulation',
    description: 'Managing and expressing emotions',
    color: '#3b82f6',
  },
  {
    key: 'motor_learning',
    label: 'Motor & Learning Profile',
    description: 'Physical coordination and uneven ability patterns',
    color: '#14b8a6',
  },
]

export const DOMAIN_MAP: Record<DomainKey, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.key, d])
) as Record<DomainKey, Domain>

export const QUESTIONS: Question[] = [
  // Social Communication
  {
    id: 'sc1',
    domain: 'social_communication',
    text: {
      self_adult: 'I find it difficult to understand unwritten social rules.',
      self_teen: 'I find it hard to know the unspoken rules of how to behave around people.',
      parent: 'My child struggles to pick up on unwritten social rules.',
      teacher: 'This student struggles to understand unwritten social rules.',
    },
  },
  {
    id: 'sc2',
    domain: 'social_communication',
    text: {
      self_adult: 'I find making or keeping friends difficult.',
      self_teen: 'I find it hard to make or keep friends.',
      parent: 'My child has difficulty making or keeping friends.',
      teacher: 'This student has difficulty forming friendships with peers.',
    },
  },
  {
    id: 'sc3',
    domain: 'social_communication',
    text: {
      self_adult: 'I prefer to spend time alone rather than with others.',
      self_teen: 'I would rather be on my own than with other people.',
      parent: 'My child prefers to be alone rather than with other children.',
      teacher: 'This student tends to prefer solitary activities over group ones.',
    },
  },
  {
    id: 'sc4',
    domain: 'social_communication',
    text: {
      self_adult: 'I find eye contact during conversation uncomfortable or unnatural.',
      self_teen: 'Making eye contact when talking to people feels uncomfortable.',
      parent: 'My child avoids or seems uncomfortable with eye contact.',
      teacher: 'This student avoids or appears uncomfortable with eye contact.',
    },
  },
  {
    id: 'sc5',
    domain: 'social_communication',
    text: {
      self_adult: "I find it hard to understand what others are thinking or feeling.",
      self_teen: "It's hard for me to figure out what other people are thinking or feeling.",
      parent: "My child finds it hard to understand others' thoughts or feelings.",
      teacher: "This student appears to have difficulty understanding others' perspectives.",
    },
  },
  {
    id: 'sc6',
    domain: 'social_communication',
    text: {
      self_adult: 'Social situations leave me feeling drained or confused.',
      self_teen: 'Being around people for a long time leaves me feeling tired or confused.',
      parent: 'My child becomes exhausted or overwhelmed after social situations.',
      teacher: 'This student appears drained or overwhelmed after group activities.',
    },
  },
  // Restricted Interests
  {
    id: 'ri1',
    domain: 'restricted_interests',
    text: {
      self_adult: 'I have one or more very intense, specific interests that I pursue deeply.',
      self_teen: 'I have a strong interest in one or a few topics that I think about a lot.',
      parent: 'My child has one or more extremely intense, focused interests.',
      teacher: 'This student has one or more intense, narrowly focused interests.',
    },
  },
  {
    id: 'ri2',
    domain: 'restricted_interests',
    text: {
      self_adult: 'I talk at length about my interests even when others seem uninterested.',
      self_teen: 'I talk a lot about my favourite topics even if others seem bored.',
      parent: 'My child talks at length about their special interest, even when others lose interest.',
      teacher: 'This student brings conversations back to their preferred topic frequently.',
    },
  },
  {
    id: 'ri3',
    domain: 'restricted_interests',
    text: {
      self_adult: 'I notice fine details in things that others tend to overlook.',
      self_teen: 'I notice small details in things that most people miss.',
      parent: 'My child notices fine details others tend to overlook.',
      teacher: 'This student notices fine details that peers typically overlook.',
    },
  },
  {
    id: 'ri4',
    domain: 'restricted_interests',
    text: {
      self_adult: 'I make repetitive movements or sounds when I am excited, stressed, or focused.',
      self_teen: 'When I am excited or stressed I sometimes rock, flap, or make sounds.',
      parent: 'My child makes repetitive movements or sounds (rocking, hand-flapping, humming).',
      teacher: 'This student makes repetitive movements or sounds, especially when excited or stressed.',
    },
  },
  {
    id: 'ri5',
    domain: 'restricted_interests',
    text: {
      self_adult: 'My range of activities or hobbies is quite narrow compared to most people.',
      self_teen: 'I have fewer hobbies or interests than most people my age.',
      parent: 'My child has a narrower range of interests than most children their age.',
      teacher: 'This student engages in a narrower range of activities than their peers.',
    },
  },
  // Sensory
  {
    id: 'se1',
    domain: 'sensory',
    text: {
      self_adult: 'I am unusually sensitive to sounds, lights, textures, smells, or tastes.',
      self_teen: 'Some sounds, lights, textures, smells or tastes bother me much more than others.',
      parent: 'My child is unusually sensitive to sounds, lights, textures, smells, or tastes.',
      teacher: 'This student appears unusually sensitive to sensory stimuli.',
    },
  },
  {
    id: 'se2',
    domain: 'sensory',
    text: {
      self_adult: 'Certain clothing fabrics, food textures, or environments cause me real distress.',
      self_teen: 'Some clothing, foods, or places make me feel really uncomfortable or distressed.',
      parent: 'My child becomes distressed by specific clothing, food textures, or environments.',
      teacher: 'This student shows significant distress related to specific sensory experiences.',
    },
  },
  {
    id: 'se3',
    domain: 'sensory',
    text: {
      self_adult: 'I become overwhelmed in busy, noisy, or bright environments.',
      self_teen: 'Busy, loud, or bright places make me feel overwhelmed.',
      parent: 'My child becomes overwhelmed in busy, loud, or visually stimulating environments.',
      teacher: 'This student becomes overwhelmed in busy or loud classroom environments.',
    },
  },
  {
    id: 'se4',
    domain: 'sensory',
    text: {
      self_adult: 'I seek out certain sensory experiences (e.g., specific textures, sounds, or movements).',
      self_teen: 'I seek out certain feelings, sounds, or movements that I find calming or satisfying.',
      parent: 'My child actively seeks out particular sensory experiences for comfort.',
      teacher: 'This student actively seeks out specific sensory experiences.',
    },
  },
  // Routines
  {
    id: 'ro1',
    domain: 'routines',
    text: {
      self_adult: 'I rely heavily on routines and feel upset when they are disrupted.',
      self_teen: 'I rely on routines and get upset when things do not go as planned.',
      parent: 'My child relies heavily on routines and becomes upset when they change.',
      teacher: 'This student becomes noticeably upset when routines change.',
    },
  },
  {
    id: 'ro2',
    domain: 'routines',
    text: {
      self_adult: 'I prefer my environment to stay the same and find rearrangements upsetting.',
      self_teen: 'I like things to stay the same and get upset if someone moves or changes things.',
      parent: 'My child insists that their environment or belongings stay arranged a certain way.',
      teacher: "This student becomes distressed when classroom arrangements change.",
    },
  },
  {
    id: 'ro3',
    domain: 'routines',
    text: {
      self_adult: 'I find transitions between activities difficult.',
      self_teen: 'Switching from one activity to another is hard for me.',
      parent: 'My child struggles to transition between activities.',
      teacher: 'This student has difficulty transitioning between activities.',
    },
  },
  {
    id: 'ro4',
    domain: 'routines',
    text: {
      self_adult: 'Unexpected changes to plans cause me significant anxiety.',
      self_teen: 'When plans change unexpectedly I feel very anxious or upset.',
      parent: 'Unexpected changes to plans cause my child significant anxiety.',
      teacher: 'Unexpected changes cause this student noticeable anxiety.',
    },
  },
  // Communication Style
  {
    id: 'cs1',
    domain: 'communication_style',
    text: {
      self_adult: 'I interpret what people say literally and can miss sarcasm, jokes, or figures of speech.',
      self_teen: 'I take what people say literally and often miss jokes or sarcasm.',
      parent: 'My child takes things very literally and misses sarcasm or figures of speech.',
      teacher: 'This student interprets language very literally and misses sarcasm or idioms.',
    },
  },
  {
    id: 'cs2',
    domain: 'communication_style',
    text: {
      self_adult: 'My speech is described as formal, precise, or unusual compared to peers.',
      self_teen: 'People say I speak in an unusual or overly formal way.',
      parent: 'My child uses unusually formal, precise, or unusual speech for their age.',
      teacher: "This student's speech pattern is notably formal or unusual for their age.",
    },
  },
  {
    id: 'cs3',
    domain: 'communication_style',
    text: {
      self_adult: 'I find it difficult to know when it is my turn to speak in conversation.',
      self_teen: 'I find it hard to know when to start or stop talking in a conversation.',
      parent: 'My child has difficulty with conversation turn-taking.',
      teacher: 'This student struggles with conversational turn-taking.',
    },
  },
  {
    id: 'cs4',
    domain: 'communication_style',
    text: {
      self_adult: "I find it hard to read facial expressions, body language, or tone of voice.",
      self_teen: "I struggle to understand facial expressions or body language.",
      parent: "My child struggles to understand facial expressions or body language.",
      teacher: "This student appears to misread facial expressions or body language.",
    },
  },
  {
    id: 'cs5',
    domain: 'communication_style',
    text: {
      self_adult: 'I have a large vocabulary but sometimes use words in slightly off ways socially.',
      self_teen: 'I know a lot of words but sometimes use them in ways that seem odd to others.',
      parent: 'My child has an advanced vocabulary but uses it in socially unusual ways.',
      teacher: "This student has strong vocabulary but uses it in socially atypical ways.",
    },
  },
  // Emotional Regulation
  {
    id: 'er1',
    domain: 'emotional_regulation',
    text: {
      self_adult: 'I have intense emotional reactions to things that others seem to handle easily.',
      self_teen: 'Small things can cause me to have big emotional reactions.',
      parent: 'My child has intense emotional reactions to things others handle easily.',
      teacher: 'This student has disproportionately intense reactions to minor events.',
    },
  },
  {
    id: 'er2',
    domain: 'emotional_regulation',
    text: {
      self_adult: 'I find it hard to identify or describe my own feelings.',
      self_teen: 'It is hard for me to describe what I am feeling inside.',
      parent: 'My child has difficulty identifying or expressing their emotions.',
      teacher: 'This student appears to have difficulty identifying or expressing their emotions.',
    },
  },
  {
    id: 'er3',
    domain: 'emotional_regulation',
    text: {
      self_adult: 'I appear calm on the outside but am experiencing strong emotions inside.',
      self_teen: 'I often look calm on the outside but feel very strong emotions inside.',
      parent: 'My child often appears calm but is actually experiencing strong inner emotions.',
      teacher: 'This student appears to mask strong emotions beneath a calm exterior.',
    },
  },
  {
    id: 'er4',
    domain: 'emotional_regulation',
    text: {
      self_adult: 'Anxiety is a significant part of my daily life.',
      self_teen: 'Anxiety or worry is a significant part of my daily life.',
      parent: 'Anxiety is a significant daily experience for my child.',
      teacher: 'This student appears to experience significant anxiety regularly.',
    },
  },
  // Motor & Learning
  {
    id: 'ml1',
    domain: 'motor_learning',
    text: {
      self_adult: 'My physical coordination or handwriting has been described as poor or unusual.',
      self_teen: 'My handwriting or physical coordination is poor compared to others my age.',
      parent: 'My child has poor coordination, balance, or handwriting for their age.',
      teacher: "This student's coordination, balance, or handwriting is notably below peer level.",
    },
  },
  {
    id: 'ml2',
    domain: 'motor_learning',
    text: {
      self_adult: 'My abilities are very uneven — exceptional in some areas, weak in others.',
      self_teen: 'I am much better at some things than others in a way that seems uneven.',
      parent: 'My child has a very uneven ability profile — very strong in some areas, weak in others.',
      teacher: 'This student shows a markedly uneven academic or skill profile.',
    },
  },
  {
    id: 'ml3',
    domain: 'motor_learning',
    text: {
      self_adult: 'I learn better from clear rules, visuals, or structured systems than from social examples.',
      self_teen: 'I learn better from clear rules or visuals than from watching what others do.',
      parent: 'My child learns better through clear rules and visual aids than social modelling.',
      teacher: 'This student responds better to explicit rules and visual supports than social cues.',
    },
  },
  {
    id: 'ml4',
    domain: 'motor_learning',
    text: {
      self_adult: 'I have an unusually strong memory for facts, numbers, or details.',
      self_teen: 'I have an unusually strong memory for facts or specific details.',
      parent: 'My child has an unusually strong memory for facts or specific details.',
      teacher: 'This student has an unusually strong factual or detail-oriented memory.',
    },
  },
]
