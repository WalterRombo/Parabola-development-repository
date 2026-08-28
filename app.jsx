// Parabola - loaded via CDN React
const { useState, useEffect, useRef, useCallback } = React;


const EXERCISE_TIME = 60;
const REST_TIME = 15;
const PREP_TIME = 10;
const CIRCUIT_SIZE = 20;
const CATEGORIES = ["Kettlebell", "Bodyweight", "Core", "Cardio", "Strength"];

// Returns the tags array for any exercise, whether it's already on the new
// multi-tag format ({tags:[...]}) or the old single-category format
// ({category:"X"}) saved before this feature existed. Using this everywhere
// instead of e.tags directly means old saved libraries keep working with
// zero data loss while the migration effect (below, in App) catches up.
function tagsOf(e) {
  if (Array.isArray(e.tags)) return e.tags;
  if (e.category) return [e.category];
  return [];
}

const DEFAULT_EXERCISES = [
  { id: "u1", name: "Sit-ups", category: "Core", description: "" },
  { id: "u2", name: "Press-ups", category: "Bodyweight", description: "" },
  { id: "u3", name: "Burpees", category: "Cardio", description: "" },
  { id: "u4", name: "Russian twists", category: "Core", description: "" },
  { id: "u5", name: "Squats", category: "Bodyweight", description: "" },
  { id: "u6", name: "Swimmers", category: "Bodyweight", description: "" },
  { id: "u7", name: "Leg raises", category: "Core", description: "" },
  { id: "u8", name: "Plank", category: "Core", description: "" },
  { id: "u9", name: "Cycling", category: "Cardio", description: "" },
  { id: "u10", name: "KB swings", category: "Kettlebell", description: "" },
  { id: "u11", name: "KB snatches", category: "Kettlebell", description: "" },
  { id: "u12", name: "Lunges", category: "Bodyweight", description: "" },
  { id: "u13", name: "Reverse lunges", category: "Bodyweight", description: "" },
  { id: "u14", name: "Overhead press", category: "Bodyweight", description: "" },
  { id: "u15", name: "Windmills", category: "Bodyweight", description: "" },
  { id: "u16", name: "Plank drag", category: "Core", description: "" },
  { id: "u17", name: "Tricep dips", category: "Bodyweight", description: "" },
  { id: "u18", name: "Skater hops", category: "Bodyweight", description: "" },
  { id: "u19", name: "Spiderman MCs", category: "Bodyweight", description: "" },
  { id: "u20", name: "SL glute bridge", category: "Bodyweight", description: "" },
  { id: "u21", name: "Donkey kicks", category: "Bodyweight", description: "" },
  { id: "u22", name: "Moving plank", category: "Core", description: "" },
  { id: "u23", name: "Jumping squats", category: "Cardio", description: "" },
  { id: "u24", name: "KB split squats", category: "Kettlebell", description: "" },
  { id: "u25", name: "KB clean", category: "Kettlebell", description: "" },
  { id: "u26", name: "CW toe taps", category: "Bodyweight", description: "" },
  { id: "u27", name: "SL deadlift", category: "Bodyweight", description: "" },
  { id: "u28", name: "V sit", category: "Bodyweight", description: "" },
  { id: "u29", name: "Plank shoulder taps", category: "Core", description: "" },
  { id: "u30", name: "Diamond push ups", category: "Bodyweight", description: "" },
  { id: "u31", name: "Mountain climbers", category: "Bodyweight", description: "" },
  { id: "u32", name: "V ups", category: "Bodyweight", description: "" },
  { id: "u33", name: "Sit-up twists", category: "Core", description: "" },
  { id: "u34", name: "Jumping lunges", category: "Cardio", description: "" },
  { id: "u35", name: "KB deadlift", category: "Kettlebell", description: "" },
  { id: "u36", name: "KB row", category: "Kettlebell", description: "" },
  { id: "u37", name: "KB upright row", category: "Kettlebell", description: "" },
  { id: "u38", name: "Forearm press-ups", category: "Bodyweight", description: "" },
  { id: "u39", name: "BJJs", category: "Bodyweight", description: "" },
  { id: "u40", name: "Side plank", category: "Core", description: "" },
  { id: "u41", name: "Side plank + dips", category: "Core", description: "" },
  { id: "u42", name: "Plank twists", category: "Core", description: "" },
  { id: "u43", name: "Bicep curls", category: "Bodyweight", description: "" },
  { id: "u44", name: "Hammer curls", category: "Bodyweight", description: "" },
  { id: "u45", name: "OH hammer curls", category: "Bodyweight", description: "" },
  { id: "u46", name: "Front flys", category: "Bodyweight", description: "" },
  { id: "u47", name: "Lateral flys", category: "Bodyweight", description: "" },
  { id: "u48", name: "Glute bridge + pullover", category: "Bodyweight", description: "" },
  { id: "u49", name: "Turkish get ups", category: "Bodyweight", description: "" },
  { id: "u50", name: "Glute bridge", category: "Bodyweight", description: "" },
  { id: "u51", name: "Lateral lunge", category: "Bodyweight", description: "" },
  { id: "u52", name: "Crawler press-up", category: "Bodyweight", description: "" },
  { id: "u53", name: "Fire hydrants", category: "Bodyweight", description: "" },
  { id: "u54", name: "Aleknas", category: "Bodyweight", description: "" },
  { id: "u55", name: "DB military press", category: "Bodyweight", description: "" },
  { id: "u56", name: "Bent over row", category: "Bodyweight", description: "" },
  { id: "u57", name: "Sofa split squat", category: "Bodyweight", description: "" },
  { id: "u58", name: "Squat w/ pull down", category: "Bodyweight", description: "" },
  { id: "u59", name: "Sofa sit-up", category: "Core", description: "" },
  { id: "u60", name: "Clams", category: "Bodyweight", description: "" },
  { id: "u61", name: "Calf raises", category: "Bodyweight", description: "" },
  { id: "u62", name: "HS static holds", category: "Bodyweight", description: "" },
  { id: "u63", name: "Wall sit", category: "Bodyweight", description: "" },
  { id: "u64", name: "Superman's", category: "Bodyweight", description: "" },
  { id: "u65", name: "1 arm plank", category: "Core", description: "" },
  { id: "u66", name: "Typewriters", category: "Bodyweight", description: "" },
  { id: "u67", name: "Seal push up", category: "Bodyweight", description: "" },
  { id: "u68", name: "Leg extension", category: "Bodyweight", description: "" },
  { id: "u69", name: "1 leg drill", category: "Bodyweight", description: "" },
  { id: "u70", name: "Elbow planche", category: "Bodyweight", description: "" },
  { id: "u71", name: "Knee to squat steps", category: "Bodyweight", description: "" },
  { id: "u72", name: "Knee to squat jumps", category: "Cardio", description: "" },
  { id: "u73", name: "KB around the world", category: "Kettlebell", description: "" },
  { id: "u74", name: "One leg squat dips", category: "Bodyweight", description: "" },
  { id: "u75", name: "Chair step ups", category: "Bodyweight", description: "" },
  { id: "u76", name: "Reverse nordics", category: "Bodyweight", description: "" },
  { id: "u77", name: "One leg stand to sit", category: "Bodyweight", description: "" },
  { id: "u78", name: "T rows", category: "Bodyweight", description: "" },
  { id: "u79", name: "Squat to press", category: "Bodyweight", description: "" },
  { id: "u80", name: "Swing to KB clean", category: "Kettlebell", description: "" },
  { id: "u81", name: "Rotational clean", category: "Bodyweight", description: "" },
  { id: "u82", name: "Scapula stretch Y", category: "Bodyweight", description: "" },
  { id: "u83", name: "Scapula stretch T", category: "Bodyweight", description: "" },
  { id: "u84", name: "SB back squat", category: "Bodyweight", description: "" },
  { id: "u85", name: "SB front squat", category: "Bodyweight", description: "" },
  { id: "u86", name: "SB front lunge", category: "Bodyweight", description: "" },
  { id: "u87", name: "SB rear lunge", category: "Bodyweight", description: "" },
  { id: "u88", name: "SB dead lift", category: "Bodyweight", description: "" },
  { id: "u89", name: "SB bent over row", category: "Bodyweight", description: "" },
  { id: "u90", name: "SB upright row", category: "Bodyweight", description: "" },
  { id: "u91", name: "SB hang clean", category: "Bodyweight", description: "" },
  { id: "u92", name: "SB mil press", category: "Bodyweight", description: "" },
  { id: "u93", name: "SB clean press squat complex", category: "Bodyweight", description: "" },
  { id: "u94", name: "SB good mornings", category: "Bodyweight", description: "" },
  { id: "u95", name: "SB hammer curls", category: "Bodyweight", description: "" },
  { id: "u96", name: "SB alternating OH press", category: "Bodyweight", description: "" },
  { id: "u97", name: "SB crawl drags", category: "Bodyweight", description: "" },
  { id: "u98", name: "SB bear hug squats", category: "Bodyweight", description: "" },
  { id: "u99", name: "Banded side steps", category: "Bodyweight", description: "" },
  { id: "u100", name: "Squat to diag knee touch", category: "Bodyweight", description: "" },
  { id: "u101", name: "Box kicks", category: "Bodyweight", description: "" },
  { id: "u102", name: "One leg glute bridge to toe touch", category: "Bodyweight", description: "" },
  { id: "u103", name: "Stair push-ups to front hop", category: "Bodyweight", description: "" },
  { id: "u104", name: "Tiger crawl", category: "Bodyweight", description: "" },
  { id: "u105", name: "Heel sit", category: "Bodyweight", description: "" },
  { id: "u106", name: "Knee 90s to kneel", category: "Bodyweight", description: "" },
  { id: "u107", name: "Static beast", category: "Bodyweight", description: "" },
  { id: "u108", name: "Static crab", category: "Bodyweight", description: "" },
  { id: "u109", name: "Travelling crab", category: "Bodyweight", description: "" },
  { id: "u110", name: "Lateral travelling ape", category: "Bodyweight", description: "" },
  { id: "u111", name: "Forward travelling Ape", category: "Bodyweight", description: "" },
  { id: "u112", name: "Unloaded to loaded beast", category: "Bodyweight", description: "" },
  { id: "u113", name: "Bear squats", category: "Bodyweight", description: "" },
  { id: "u114", name: "Ape reach", category: "Bodyweight", description: "" },
  { id: "u115", name: "Crab reach", category: "Bodyweight", description: "" },
  { id: "u116", name: "Scorpion reach", category: "Bodyweight", description: "" },
  { id: "u117", name: "Hurdlers", category: "Bodyweight", description: "" },
  { id: "u118", name: "Downward dog", category: "Bodyweight", description: "" },
  { id: "u119", name: "Front steps", category: "Bodyweight", description: "" },
  { id: "u120", name: "Front step kick through", category: "Bodyweight", description: "" },
  { id: "u121", name: "Side kick through", category: "Bodyweight", description: "" },
  { id: "u122", name: "KB bottoms up + cradle swings", category: "Kettlebell", description: "" },
  { id: "u123", name: "Assisted pistol squats", category: "Bodyweight", description: "" },
  { id: "u124", name: "Assisted cossack squats", category: "Bodyweight", description: "" },
  { id: "u125", name: "KB swing, squat, clean complex", category: "Kettlebell", description: "" },
  { id: "u126", name: "KB coil/lunge to OH press", category: "Kettlebell", description: "" },
  { id: "u127", name: "Knee to floors", category: "Bodyweight", description: "" },
  { id: "u128", name: "Monkey turns", category: "Bodyweight", description: "" },
  { id: "u129", name: "Hangs", category: "Bodyweight", description: "" },
  { id: "u130", name: "Scissors", category: "Bodyweight", description: "" },
  { id: "u131", name: "Knee to Elbows", category: "Bodyweight", description: "" },
  { id: "u132", name: "L-Sit", category: "Core", description: "" },
  { id: "u133", name: "Wipers", category: "Bodyweight", description: "" },
  { id: "u134", name: "Hollow Hold", category: "Core", description: "" },
  { id: "u135", name: "V sit rotations", category: "Bodyweight", description: "" },
  { id: "u136", name: "Long arm crunches", category: "Core", description: "" },
  { id: "u137", name: "Dead bugs", category: "Core", description: "" },
  { id: "u138", name: "L sit lift and taps", category: "Bodyweight", description: "" },
  { id: "u139", name: "Rope curls", category: "Bodyweight", description: "" },
  { id: "u140", name: "KB clean and squat", category: "Kettlebell", description: "" },
  { id: "u141", name: "KB ski swing", category: "Kettlebell", description: "" },
  { id: "u142", name: "Foot domes", category: "Bodyweight", description: "" },
  { id: "u143", name: "Bench press", category: "Bodyweight", description: "" },
  { id: "u144", name: "Dbl KB swings", category: "Kettlebell", description: "" },
  { id: "u145", name: "Dbl KB alt rows", category: "Kettlebell", description: "" },
  { id: "u146", name: "Gunslingers", category: "Bodyweight", description: "" },
  { id: "u147", name: "Rack squats", category: "Bodyweight", description: "" },
  { id: "u148", name: "DBL KB burpees", category: "Kettlebell", description: "" },
  { id: "u149", name: "DBL KB alternating rack press", category: "Kettlebell", description: "" },
  { id: "u150", name: "KB pressups", category: "Kettlebell", description: "" },
  { id: "u151", name: "DBL KB plank row/renegade row", category: "Kettlebell", description: "" },
  { id: "u152", name: "DBL KB rack cleans", category: "Kettlebell", description: "" },
  { id: "u153", name: "DBL KB clean and jerk", category: "Kettlebell", description: "" },
  { id: "u154", name: "DBL KB alternating clean", category: "Kettlebell", description: "" },
  { id: "u155", name: "DBL KB SL Deadlift", category: "Kettlebell", description: "" },
  { id: "u156", name: "DBL KB deadlift", category: "Kettlebell", description: "" },
  { id: "u157", name: "DBL KB farmers carry", category: "Kettlebell", description: "" },
  { id: "u158", name: "DBL KB lunges", category: "Kettlebell", description: "" },
  { id: "u159", name: "DBL KB swings", category: "Kettlebell", description: "" },
  { id: "u160", name: "DBL KB floor press", category: "Kettlebell", description: "" },
  { id: "u161", name: "Kneeling wood chop", category: "Bodyweight", description: "" },
  { id: "u162", name: "Butterfly sit ups", category: "Bodyweight", description: "" },
  { id: "u163", name: "High/low boat", category: "Bodyweight", description: "" },
  { id: "u164", name: "Plank saw", category: "Core", description: "" },
  { id: "u165", name: "Core roll ups", category: "Bodyweight", description: "" },
  { id: "u166", name: "Plank leg lifts", category: "Core", description: "" },
  { id: "u167", name: "Dbl KB gorilla rows", category: "Kettlebell", description: "" },
  { id: "u168", name: "Goblet squat", category: "Bodyweight", description: "" },
  { id: "u169", name: "KB swing and snatch", category: "Kettlebell", description: "" },
  { id: "u170", name: "Kenyans", category: "Bodyweight", description: "" },
  { id: "u171", name: "RB pull", category: "Bodyweight", description: "" },
  { id: "u172", name: "RB press", category: "Bodyweight", description: "" },
  { id: "u173", name: "RB lateral press", category: "Bodyweight", description: "" },
  { id: "u174", name: "KB tactical press", category: "Kettlebell", description: "" },
  { id: "u175", name: "Shadow box", category: "Bodyweight", description: "" },
  { id: "u176", name: "RB pull down", category: "Bodyweight", description: "" },
  { id: "u177", name: "Sitting to pistol squat switch", category: "Bodyweight", description: "" },
  { id: "u178", name: "RB press (2)", category: "Bodyweight", description: "" },
  { id: "u179", name: "Glute bridge KB chest press", category: "Kettlebell", description: "" },
  { id: "u180", name: "Skipping", category: "Cardio", description: "" },
  { id: "u181", name: "KB figure 8s", category: "Kettlebell", description: "" },
  { id: "u182", name: "Lunge to hop", category: "Bodyweight", description: "" },
  { id: "u183", name: "DB/KB lunge to around the world", category: "Kettlebell", description: "" },
  { id: "u184", name: "Bridging", category: "Bodyweight", description: "" },
  { id: "u185", name: "Chair L sit", category: "Bodyweight", description: "" },
  { id: "u186", name: "Tuck L sit", category: "Bodyweight", description: "" },
  { id: "u187", name: "KB ballistic rows", category: "Kettlebell", description: "" },
  { id: "u188", name: "Rotational DBL shoulder press", category: "Bodyweight", description: "" },
  { id: "u189", name: "KB half kneeling chops", category: "Kettlebell", description: "" },
  { id: "u190", name: "Airplanes", category: "Bodyweight", description: "" },
  { id: "u191", name: "DB forward ski swing and squat", category: "Bodyweight", description: "" },
  { id: "u192", name: "Hangs (bar)", category: "Bodyweight", description: "" },
  { id: "u193", name: "One arm hangs", category: "Bodyweight", description: "" },
  { id: "u194", name: "Hanging shrugs", category: "Bodyweight", description: "" },
  { id: "u195", name: "Hanging tucks", category: "Bodyweight", description: "" },
  { id: "u196", name: "Hanging leg raises", category: "Core", description: "" },
  { id: "u197", name: "Chin ups", category: "Bodyweight", description: "" },
  { id: "u198", name: "Pull ups", category: "Bodyweight", description: "" },
  { id: "u199", name: "Pad work", category: "Bodyweight", description: "" },
  { id: "u200", name: "KB hammer curls", category: "Kettlebell", description: "" },
  { id: "u201", name: "Seated goblet press", category: "Bodyweight", description: "" },
  { id: "u202", name: "Standing OH tac press/waiter press", category: "Bodyweight", description: "" },
  { id: "u203", name: "Box jumps", category: "Cardio", description: "" },
  { id: "u204", name: "Broom overs", category: "Bodyweight", description: "" },
  { id: "u205", name: "Dbl KB suitcase Deadlift", category: "Kettlebell", description: "" },
  { id: "u206", name: "Reverse plank", category: "Core", description: "" },
  { id: "u207", name: "Reverse plank knee tucks", category: "Core", description: "" },
  { id: "u208", name: "High side plank leg raises", category: "Core", description: "" },
  { id: "u209", name: "Single arm KB swings", category: "Kettlebell", description: "" },
  { id: "u210", name: "Cossack squats (unassisted)", category: "Bodyweight", description: "" },
  { id: "u211", name: "Duck and weave KB squats", category: "Kettlebell", description: "" },
  { id: "u212", name: "Over bar hangs", category: "Bodyweight", description: "" },
  { id: "u213", name: "Switch grip hangs", category: "Bodyweight", description: "" },
  { id: "u214", name: "Suitcase KB deadlifts", category: "Kettlebell", description: "" },
  { id: "u215", name: "KB OH hold sit-ups", category: "Kettlebell", description: "" },
  { id: "u216", name: "Banded standing lateral leg raises", category: "Core", description: "" },
  { id: "u217", name: "DB weighted hook punches", category: "Bodyweight", description: "" },
  { id: "u218", name: "DB weighted straight punches", category: "Bodyweight", description: "" },
  { id: "u219", name: "Weighted step ups", category: "Bodyweight", description: "" },
  { id: "u220", name: "RB plantar flexion", category: "Bodyweight", description: "" },
  { id: "u221", name: "Arnold DB press", category: "Bodyweight", description: "" },
  { id: "u222", name: "Seated Arnold DB press", category: "Bodyweight", description: "" },
  { id: "u223", name: "RB Squat", category: "Bodyweight", description: "" },
  { id: "u224", name: "RB OH tricep extension", category: "Bodyweight", description: "" },
  { id: "u225", name: "RB Hammer curls", category: "Bodyweight", description: "" },
  { id: "u226", name: "RB Bicep curls", category: "Bodyweight", description: "" },
  { id: "u227", name: "RB pull apart", category: "Bodyweight", description: "" },
  { id: "u228", name: "Kneeling RB lat pull down", category: "Bodyweight", description: "" },
  { id: "u229", name: "RB upright row", category: "Bodyweight", description: "" },
  { id: "u230", name: "Thin RB bent over delt fly", category: "Bodyweight", description: "" },
  { id: "u231", name: "RB arm lat pull down", category: "Bodyweight", description: "" },
  { id: "u232", name: "RB thrusters", category: "Bodyweight", description: "" },
  { id: "u233", name: "Alternating OH holding DB press", category: "Bodyweight", description: "" },
  { id: "u234", name: "DBL KB box squats", category: "Kettlebell", description: "" },
  { id: "u235", name: "KB OH bullhorn curls behind head", category: "Kettlebell", description: "" },
  { id: "u236", name: "One leg high knee jump pyramid", category: "Cardio", description: "" },
  { id: "u237", name: "2H Club lateral swing", category: "Bodyweight", description: "" },
  { id: "u238", name: "CB low high lateral swings", category: "Bodyweight", description: "" },
  { id: "u239", name: "CB single arm pullovers", category: "Bodyweight", description: "" },
  { id: "u240", name: "CB single arm shieldcast", category: "Bodyweight", description: "" },
  { id: "u241", name: "CB double arm pullovers", category: "Bodyweight", description: "" },
  { id: "u242", name: "CB double arm shieldcast", category: "Bodyweight", description: "" },
  { id: "u243", name: "Pigeon", category: "Bodyweight", description: "" },
  { id: "u244", name: "CB dead clean", category: "Bodyweight", description: "" },
  { id: "u245", name: "CB 2 hand inside circles", category: "Bodyweight", description: "" },
  { id: "u246", name: "CB 2 hand outside circles", category: "Bodyweight", description: "" },
  { id: "u247", name: "CB single hand inside circles", category: "Bodyweight", description: "" },
  { id: "u248", name: "CB single hand outside circles", category: "Bodyweight", description: "" },
  { id: "u249", name: "CB single hand inside pullovers", category: "Bodyweight", description: "" },
  { id: "u250", name: "CB single hand outside pullovers", category: "Bodyweight", description: "" },
  { id: "u251", name: "CB double hand outside pendulum", category: "Bodyweight", description: "" },
  { id: "u252", name: "KB swings with changing hands", category: "Kettlebell", description: "" },
  { id: "u253", name: "KB clean to press", category: "Kettlebell", description: "" },
  { id: "u254", name: "Continuous KB snatches", category: "Kettlebell", description: "" },
  { id: "u255", name: "Continuous KB cleans", category: "Kettlebell", description: "" },
  { id: "u256", name: "Back scratchers", category: "Bodyweight", description: "" },
  { id: "u257", name: "Broom figure 8s", category: "Bodyweight", description: "" },
  { id: "u258", name: "Press up to superman", category: "Bodyweight", description: "" },
  { id: "u259", name: "Sumo squat hold (spine stretch)", category: "Bodyweight", description: "" },
  { id: "u260", name: "Hip abductor leg lifts", category: "Bodyweight", description: "" },
  { id: "u261", name: "Squat shoulder stretch", category: "Bodyweight", description: "" },
  { id: "u262", name: "SL RDL", category: "Bodyweight", description: "" },
  { id: "u263", name: "CB single hand side pullover", category: "Bodyweight", description: "" },
  { id: "u264", name: "CB 2H swing to squat", category: "Bodyweight", description: "" },
  { id: "u265", name: "CB 2H lunge to upper body rotation", category: "Bodyweight", description: "" },
  { id: "u266", name: "CB 1H inside mill", category: "Bodyweight", description: "" },
  { id: "u267", name: "CB 2H push press", category: "Bodyweight", description: "" },
  { id: "u268", name: "CB 1H outside mill", category: "Bodyweight", description: "" },
  { id: "u269", name: "CB 2H inside/outside circles to squat", category: "Bodyweight", description: "" },
  { id: "u270", name: "CB 2H alternating in/out circles", category: "Bodyweight", description: "" },
  { id: "u271", name: "KB shrugs", category: "Kettlebell", description: "" },
  { id: "u272", name: "KB clean and jerk", category: "Kettlebell", description: "" },
  { id: "u273", name: "Reverse DB flys bent over", category: "Bodyweight", description: "" },
  { id: "u274", name: "Seated DB wrist curls", category: "Bodyweight", description: "" },
  { id: "u275", name: "KB Romanian deadlift", category: "Kettlebell", description: "" },
  { id: "u276", name: "Seated reverse DB wrist curls", category: "Bodyweight", description: "" },
  { id: "u277", name: "Towel hangs", category: "Bodyweight", description: "" },
  { id: "u278", name: "Close hand pressups", category: "Bodyweight", description: "" },
  { id: "u279", name: "Seated wrist curls", category: "Bodyweight", description: "" },
  { id: "u280", name: "Seated reverse wrist curls", category: "Bodyweight", description: "" },
  { id: "u281", name: "KB standing marches", category: "Kettlebell", description: "" },
  { id: "u282", name: "KB OH standing marches", category: "Kettlebell", description: "" },
  { id: "u283", name: "KB 2 handed OH standing marches", category: "Kettlebell", description: "" },
  { id: "u284", name: "KB twist to OH tricep curl", category: "Kettlebell", description: "" },
  { id: "u285", name: "KB rotation upper cut", category: "Kettlebell", description: "" },
  { id: "u286", name: "KB lunge", category: "Kettlebell", description: "" },
  { id: "u287", name: "KB dead high pull", category: "Kettlebell", description: "" },
  { id: "u288", name: "KB devils halo", category: "Kettlebell", description: "" },
  { id: "u289", name: "KB dead halo", category: "Kettlebell", description: "" },
  { id: "u290", name: "Seated/kneeling KB wrist flexion", category: "Kettlebell", description: "" },
  { id: "u291", name: "KB cradle overhead press", category: "Kettlebell", description: "" },
];

function getToday() { return new Date().toISOString().split("T")[0]; }
function getYear()  { return new Date().getFullYear().toString(); }
function fmt(s)     { return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; }

function buildWorkout(exercises) {
  if (!exercises.length) return [];
  const result = [];
  while (result.length < CIRCUIT_SIZE) {
    const sh = [...exercises].sort(() => Math.random() - 0.5);
    result.push(...sh.slice(0, Math.min(sh.length, CIRCUIT_SIZE - result.length)));
  }
  return result;
}

// ── Audio engine ─────────────────────────────────────────────────────────
// iOS Safari will only create an AudioContext inside a direct user-gesture
// (tap/touch) handler. Sounds fired from setInterval are NOT user gestures,
// so creating a new AudioContext there fails silently every time.
//
// Fix: create ONE AudioContext on the first tap (startWorkout button),
// store it in a module-level ref, and reuse it for every subsequent tone.
// ctx.resume() handles the case where iOS suspends it after a page hide.

let _audioCtx = null;

function getAudioCtx() {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new AudioContext();
  }
  // iOS suspends the context when the page is hidden — resume it
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

// Play a single tone. Must be called with the shared ctx, NOT a new one.
// type: "square" (harsh/buzzy), "sine" (smooth), "triangle" (soft), "sawtooth" (bright)
function beep(freq = 440, dur = 0.15, vol = 0.25, type = "square") {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch {}
}

// Play multiple tones in sequence using the SAME shared context
function beepSeq(tones) {
  try {
    const ctx = getAudioCtx();
    let t = ctx.currentTime;
    tones.forEach(([freq, dur, vol, type = "sine"]) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur);
      t += dur + 0.04;
    });
  } catch {}
}

// ── useStorage: read SYNCHRONOUSLY at init, write with visible error handling ──
//
// Previous version read localStorage in a useEffect (after first render).
// This left a window where useState(init) — the DEFAULT_EXERCISES — was the
// live state. During that window the migration effect would fire, see
// DEFAULT_EXERCISES (which have no tags), and call saveExercises — potentially
// writing DEFAULT_EXERCISES back to localStorage before the real stored data
// was loaded. Any exercise added by the user in that window could also be
// built on top of the stale default data.
//
// Fix: pass a lazy initialiser function to useState. React calls it once,
// synchronously, before any render or effect — so localStorage is read at
// exactly the right moment and the DEFAULT_EXERCISES value is never live.
function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return typeof init === "function" ? init() : init;
  });
  const valRef = useRef(val);  // initialise to the REAL loaded value, not init

  const save = useCallback((u, onError) => {
    const next = typeof u === "function" ? u(valRef.current) : u;
    valRef.current = next;   // update ref synchronously before any async work
    setVal(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      // Surface write failures to the caller instead of silently swallowing
      if (onError) onError(e);
      else console.error("Parabola storage write failed:", key, e);
    }
  }, [key]);

  return [val, save];
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;700&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0d0d0b;--s1:#161613;--s2:#1c1c19;--bd:#272723;
  --tx:#eeebe2;--mu:#686860;--ac:#e05c1a;--ac2:#f0c040;
  --gn:#4da870;--rd:#d95050;--sv:#fc5200;
}
body{background:var(--bg);margin:0;}
.app{font-family:'DM Sans',system-ui,sans-serif;background:var(--bg);color:var(--tx);min-height:100svh;max-width:430px;margin:0 auto;padding-bottom:68px;}
.hdr{padding:16px 18px 12px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--bd);}
.hdr-l .t{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;color:var(--ac);line-height:1;}
.hdr-l .s{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mu);letter-spacing:1px;margin-top:2px;}
.hdr-r{text-align:right;}
.hdr-r .n{font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--tx);line-height:1;}
.hdr-r .s{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--mu);letter-spacing:1px;}
.tabs{position:fixed;bottom:0;width:100%;max-width:430px;background:var(--s1);border-top:1px solid var(--bd);display:flex;z-index:99;}
.tab{flex:1;border:none;background:none;color:var(--mu);display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 6px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;transition:color .15s;}
.tab.on{color:var(--ac);}
.tab-ic{font-size:21px;line-height:1;}
.pg{padding:14px 14px 0;}
.card{background:var(--s1);border:1px solid var(--bd);border-radius:3px;padding:13px;margin-bottom:10px;}
.ct{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;}
.sg{display:grid;grid-template-columns:repeat(3,1fr);}
.sc{text-align:center;padding:8px 2px;border-right:1px solid var(--bd);}
.sc:last-child{border-right:none;}
.sv{font-family:'Bebas Neue',sans-serif;font-size:38px;color:var(--ac);line-height:1;}
.sl{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:1.5px;margin-top:2px;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 18px;border:none;border-radius:2px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:all .15s;}
.full{width:100%;}
.bp{background:var(--ac);color:#fff;}
.bp:hover{filter:brightness(1.1);}
.bs{background:var(--s2);color:var(--tx);border:1px solid var(--bd);}
.bg{background:none;color:var(--mu);border:1px solid var(--bd);}
.brm{background:none;color:var(--rd);border:none;padding:5px 8px;font-size:11px;cursor:pointer;font-family:'IBM Plex Mono',monospace;letter-spacing:1px;}
.bsv{background:var(--sv);color:white;}
.bsm{padding:8px 14px;font-size:11px;}
.row{display:flex;gap:8px;}
.xrow{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--bd);}
.xrow:last-child{border-bottom:none;}
.xn{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mu);width:22px;flex-shrink:0;}
.xnm{flex:1;font-size:14px;font-weight:400;}
.badge{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 6px;border-radius:1px;flex-shrink:0;}
.kb{background:rgba(224,92,26,.15);color:var(--ac);}
.bw{background:rgba(240,192,64,.12);color:var(--ac2);}
.co{background:rgba(77,168,112,.12);color:var(--gn);}
.ot{background:var(--s2);color:var(--mu);}
.tg{background:rgba(80,180,200,.14);color:#5fc7dd;}
.inp{width:100%;background:var(--s2);border:1px solid var(--bd);border-radius:2px;color:var(--tx);padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;margin-bottom:8px;}
.inp:focus{border-color:var(--ac);}
.sel{background:var(--s2);border:1px solid var(--bd);border-radius:2px;color:var(--tx);padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;flex:1;}
.ftabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;}
.ftab{padding:4px 9px;border:1px solid var(--bd);background:none;color:var(--mu);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:1px;}
.ftab.on{background:var(--ac);color:white;border-color:var(--ac);}
.tw{padding:4px 0;}
.tph{font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:4px;color:var(--mu);text-align:center;margin-bottom:6px;}
.tex{font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:2px;text-align:center;line-height:1.1;min-height:50px;}
.tnx{font-family:'IBM Plex Mono',monospace;font-size:20px;color:var(--mu);text-align:center;margin-top:6px;letter-spacing:1px;}
.tdig{font-family:'IBM Plex Mono',monospace;font-size:82px;font-weight:700;text-align:center;line-height:1;margin:10px 0 6px;transition:color .3s;}
.pb{height:19px;background:var(--bd);border-radius:4px;overflow:hidden;margin:10px 0 16px;}
.pf{height:100%;border-radius:4px;transition:width 1s linear,background .3s;}
.dots{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:12px;}
.dot{width:10px;height:10px;border-radius:50%;background:var(--bd);}
.dot.dn{background:var(--ac);}
.dot.cu{background:var(--ac2);}
.comp{text-align:center;padding:28px 10px;}
.comp-big{font-family:'Bebas Neue',sans-serif;font-size:72px;letter-spacing:4px;color:var(--ac);line-height:1;}
.comp-sub{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--mu);margin-top:10px;}
.sr{display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-bottom:1px solid var(--bd);}
.sr:last-child{border-bottom:none;}
.srl{font-size:13px;color:var(--mu);}
.srv{font-family:'Bebas Neue',sans-serif;font-size:30px;color:var(--ac);letter-spacing:1px;}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-top:8px;}
.cd{aspect-ratio:1;border-radius:2px;background:var(--s2);display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--mu);}
.cd.dn{background:var(--ac);color:white;}
.cd.ms{background:rgba(217,80,80,.2);color:var(--rd);}
.cd.td{outline:1px solid var(--ac2);}
.cd.hd{background:none;}
.cal-leg{display:flex;gap:12px;justify-content:center;margin-top:8px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--mu);}
.done-banner{background:rgba(77,168,112,.08);border:1px solid rgba(77,168,112,.3);border-radius:2px;padding:10px 14px;text-align:center;margin-bottom:10px;color:var(--gn);font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;}
.cftabs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;}
.cftab{flex:1;min-width:0;border:1px solid var(--bd);background:none;color:var(--mu);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border-radius:2px;padding:6px 4px;text-align:center;transition:all .15s;white-space:nowrap;}
.cftab.on{background:var(--ac);color:white;border-color:var(--ac);}
.cftab.bw-on{background:var(--ac2);color:#111;border-color:var(--ac2);}
.filter-badge{display:inline-flex;align-items:center;gap:5px;font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;padding:3px 8px;border-radius:2px;margin-bottom:10px;background:var(--s2);border:1px solid var(--bd);color:var(--mu);}
.filter-badge.active{border-color:var(--ac);color:var(--ac);}
.filter-badge.bw-active{border-color:var(--ac2);color:var(--ac2);}
.bw-quick{background:rgba(240,192,64,.08);border:1px solid rgba(240,192,64,.3);color:var(--ac2);}
.bw-quick:hover{background:rgba(240,192,64,.18);}
.idle-ctr{text-align:center;padding:48px 20px;}
.idle-t{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;color:var(--mu);margin-bottom:24px;}
.muted{color:var(--mu);font-size:13px;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
.pulse{animation:pulse .6s ease-in-out infinite;}
.sound-btn{position:absolute;top:14px;right:14px;background:none;border:1px solid var(--bd);border-radius:2px;color:var(--mu);padding:5px 9px;font-size:11px;cursor:pointer;font-family:'IBM Plex Mono',monospace;letter-spacing:1px;}
.sound-btn.on{color:var(--ac);border-color:var(--ac);}
.strava-card{border-color:rgba(252,82,0,.3);background:rgba(252,82,0,.04);}
.strava-title{color:var(--sv);}
.strava-note{font-size:10px;color:var(--mu);margin-top:8px;font-family:'IBM Plex Mono',monospace;line-height:1.7;}
.strava-connected{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--gn);margin-bottom:8px;}
.pin-overlay{position:fixed;inset:0;background:#0d0d0b;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;gap:16px;}
.pin-title{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:3px;color:var(--ac);}
.pin-sub{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mu);letter-spacing:2px;}
.pin-dots{display:flex;gap:12px;margin:8px 0;}
.pin-dot{width:14px;height:14px;border-radius:50%;border:1px solid var(--mu);}
.pin-dot.filled{background:var(--ac);border-color:var(--ac);}
.pin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:220px;}
.pin-key{background:var(--s1);border:1px solid var(--bd);border-radius:3px;padding:14px;font-family:'Bebas Neue',sans-serif;font-size:24px;text-align:center;cursor:pointer;color:var(--tx);transition:background .1s;}
.pin-key:hover{background:var(--s2);}
.pin-err{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--rd);letter-spacing:1px;}
.settings-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--bd);}
.settings-row:last-child{border-bottom:none;}
.settings-lbl{font-size:13px;}
.settings-val{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--mu);}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
input[type=number]{-moz-appearance:textfield;}
`;

function ExerciseRow({ ex, catCls, allTags, onRemove, onDescChange, onToggleTag }) {
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(ex.description || "");
  const hasDesc = ex.description && ex.description.trim().length > 0;
  const myTags = tagsOf(ex);

  function save() {
    onDescChange(draft);
    setEditing(false);
  }

  return (
    <div style={{borderBottom:"1px solid var(--bd)"}}>
      <div className="xrow" style={{borderBottom:"none",cursor:"pointer"}} onClick={() => { if(!editing) setOpen(o=>!o); }}>
        <span className="xnm" style={{userSelect:"none"}}>{ex.name}</span>
        <span style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end",flexShrink:0}}>
          {myTags.length === 0 && <span className="badge ot">untagged</span>}
          {myTags.map(tag => (
            <span key={tag} className={catCls(tag)}>{tag}</span>
          ))}
        </span>
        {hasDesc && <span style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--ac)",marginLeft:4,flexShrink:0}}>✎</span>}
        <span style={{fontFamily:"IBM Plex Mono",fontSize:10,color:"var(--mu)",flexShrink:0,marginLeft:4}}>
          {open ? "▲" : "▼"}
        </span>
        <button className="brm" style={{flexShrink:0}} onClick={e=>{e.stopPropagation();onRemove();}}>✕</button>
      </div>
      {open && (
        <div style={{padding:"8px 0 10px",paddingLeft:22}}>

          {/* ── Tag editor — tap any tag to toggle it on/off for this exercise ── */}
          <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>
            Tags
          </div>
          <div className="ftabs" style={{marginBottom:12}}>
            {allTags.map(tag => {
              const isOn = myTags.includes(tag);
              return (
                <button
                  key={tag}
                  className={`ftab ${isOn ? "on" : ""}`}
                  onClick={e => { e.stopPropagation(); onToggleTag(tag); }}
                >{tag}</button>
              );
            })}
          </div>

          {editing ? (
            <>
              <textarea
                className="inp"
                rows={3}
                style={{resize:"vertical",marginBottom:6,fontSize:13}}
                value={draft}
                autoFocus
                onChange={e => setDraft(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
              <div className="row">
                <button className="btn bp bsm" style={{flex:1}} onClick={e=>{e.stopPropagation();save();}}>Save</button>
                <button className="btn bg bsm" style={{flex:1}} onClick={e=>{e.stopPropagation();setDraft(ex.description||"");setEditing(false);}}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              {hasDesc ? (
                <p style={{fontSize:13,color:"var(--mu)",lineHeight:1.6,marginBottom:8}}>{ex.description}</p>
              ) : (
                <p style={{fontSize:12,color:"var(--mu)",fontFamily:"IBM Plex Mono",letterSpacing:1,marginBottom:8}}>No description yet</p>
              )}
              <button className="btn bg bsm" onClick={e=>{e.stopPropagation();setEditing(true);}}>
                {hasDesc ? "✎ Edit description" : "+ Add description"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const today   = getToday();
  const yearStr = getYear();

  const [exercises,      saveExercises]      = useStorage("kb_ex_v4",      DEFAULT_EXERCISES);
  const [customTags,     saveCustomTags]     = useStorage("kb_custom_tags_v1", []);

  // One-time migration: run synchronously at mount, not in a reactive effect.
  // useEffect with [exercises] fires on EVERY exercises change, which means
  // it fires when the user adds an exercise, creating a second concurrent
  // write to localStorage. Moving this to a plain useEffect with [] (empty
  // deps) means it fires exactly once after the first render — and since
  // localStorage is now read synchronously in useState, the exercises value
  // here is already the stored library, not DEFAULT_EXERCISES.
  useEffect(() => {
    const needsMigration = exercises.some(e => !Array.isArray(e.tags));
    if (needsMigration) {
      saveExercises(prev => prev.map(e =>
        Array.isArray(e.tags) ? e : { ...e, tags: e.category ? [e.category] : [] }
      ));
    }
  }, []); // ← empty deps: runs once on mount only, never on subsequent changes

  // Full set of tags available to filter/assign by: built-in categories +
  // user-created custom tags, deduplicated.
  const allTags = [...new Set([...CATEGORIES, ...customTags])];

  function addCustomTag(name) {
    const clean = name.trim();
    if (!clean) return;
    const exists = allTags.some(t => t.toLowerCase() === clean.toLowerCase());
    if (exists) return;
    saveCustomTags(prev => [...prev, clean]);
  }

  function removeCustomTag(tag) {
    saveCustomTags(prev => prev.filter(t => t !== tag));
    // Strip the deleted tag from every exercise so nothing references a
    // tag that no longer exists in the picker
    saveExercises(prev => prev.map(e => ({ ...e, tags: tagsOf(e).filter(t => t !== tag) })));
    // If this tag was the active filter anywhere, fall back to "All"
    if (circuitFilter === tag) saveCircuitFilter("All");
    if (filterCat === tag) setFilterCat("All");
  }

  function toggleExerciseTag(id, tag) {
    saveExercises(prev => prev.map(e => {
      if (e.id !== id) return e;
      const current = tagsOf(e);
      const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
      return { ...e, tags: next };
    }));
  }
  const [stats,          saveStats]          = useStorage("kb_stats_v3",    { history: [] });
  const [todayWorkout,   saveTodayWorkout]   = useStorage("kb_today_v3",   { date: null, sets: [], filter: "All" });
  const [circuitFilter,  saveCircuitFilter]  = useStorage("kb_filter_v1",   "All");
  const [stravaData,     saveStravaData]     = useStorage("strava_oauth_v1", {
    clientId: "", clientSecret: "", accessToken: "", refreshToken: "", expiresAt: 0
  });
  // Detect ?code= callback from Strava and immediately clear it from URL
  const [pendingCode] = useState(() => {
    const p = new URLSearchParams(window.location.search).get("code") || "";
    if (p) window.history.replaceState({}, "", window.location.pathname);
    return p;
  });
  const [stravaConnecting, setStravaConnecting] = useState(false);
  const [pin,            savePin]            = useStorage("kb_pin",         "");
  const [soundOn,        setSoundOn]         = useState(true);

  const [tab,        setTab]     = useState("today");
  const [unlocked,   setUnlocked]= useState(false);
  const [pinInput,   setPinInput]= useState("");
  const [pinError,   setPinError]= useState(false);
  const [settingPin, setSettingPin]= useState("");

  // Timer refs
  const phaseRef    = useRef("idle");
  const prevPhaseRef= useRef("exercise");
  const setIdxRef   = useRef(0);
  const timeRef     = useRef(EXERCISE_TIME);
  const completedRef= useRef(false);
  const intervalRef  = useRef(null);
  const wakeLockRef  = useRef(null);

  // ── Wake Lock: prevents phone screen from sleeping during workout ──
  async function requestWakeLock() {
    if ("wakeLock" in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch (e) { /* silently ignore — device may not support it */ }
    }
  }
  function releaseWakeLock() {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }
  // Re-acquire wake lock if user switches away and back while workout is running
  useEffect(() => {
    const handleVisibility = () => {
      const active = ["exercise","rest","prep"].includes(phaseRef.current);
      if (document.visibilityState === "visible" && active) requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Timer state (for render)
  const [phase,   setPhase]   = useState("idle");
  const [setIdx,  setSetIdx]  = useState(0);
  const [timeLeft, setTimeLeft]= useState(EXERCISE_TIME);

  // Library UI
  const [newName, setNewName]   = useState("");
  const [newCat,  setNewCat]    = useState("Kettlebell");
  const [newTagInput,  setNewTagInput]  = useState("");
  const [saveMsg,      setSaveMsg]      = useState(""); // "" | "saved" | "error"
  const [filterCat,setFilterCat]= useState("All");
  const [searchQ, setSearchQ]   = useState("");

  // Strava UI
  const [stravaSetupId,     setStravaSetupId]     = useState("");
  const [stravaSetupSecret, setStravaSetupSecret] = useState("");
  const [stravaPosted,      setStravaPosted]      = useState(false);
  const [stravaErr,         setStravaErr]         = useState("");

  // Computed stats (history counts + manual base offsets)
  const yearHistory       = stats.history.filter(h => h.date.startsWith(yearStr));
  const histTotal         = stats.history.filter(h => h.completed).length;
  const histYear          = yearHistory.filter(h => h.completed).length;
  const histMissed        = yearHistory.filter(h => !h.completed).length;
  const totalCompleted    = histTotal   + (stats.baseTotal  || 0);
  const yearCompleted     = histYear    + (stats.baseYear   || 0);
  const yearMissed        = histMissed  + (stats.baseMissed || 0);
  const [editingStat, setEditingStat] = useState(null);
  const [statDraft,   setStatDraft]   = useState("");
  const hasWorkout        = todayWorkout.date === today && todayWorkout.sets.length > 0;
  const todayEntry        = stats.history.find(h => h.date === today);
  const todayDone         = todayEntry?.completed === true;
  const currentEx         = hasWorkout ? todayWorkout.sets[setIdx] : null;
  // "Next" and "After that" lookups for workout display
  // During exercise phase: currentEx=sets[N], nextEx=sets[N+1], afterEx=sets[N+2]
  // During rest phase: setIdx was already incremented, so currentEx=sets[N+1] (upcoming),
  //   nextEx=sets[N+2] (the one after that)
  const nextEx  = hasWorkout && setIdx + 1 < CIRCUIT_SIZE ? todayWorkout.sets[setIdx + 1] : null;
  const afterEx = hasWorkout && setIdx + 2 < CIRCUIT_SIZE ? todayWorkout.sets[setIdx + 2] : null;

  // PIN logic
  const needsPin = pin !== "" && !unlocked;
  function tryPin(attempt) {
    if (attempt === pin) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPinInput(""); }
  }
  function pressKey(k) {
    if (pinInput.length >= 4) return;
    const next = pinInput + k;
    setPinInput(next);
    setPinError(false);
    if (next.length === 4) tryPin(next);
  }

  function logComplete() {
    saveStats(prev => {
      const hist = prev.history.filter(h => h.date !== today);
      return { ...prev, history: [...hist, { date: today, completed: true }] };
    });
  }
  function logMissed() {
    saveStats(prev => {
      if (prev.history.find(h => h.date === today)) return prev;
      return { ...prev, history: [...prev.history, { date: today, completed: false }] };
    });
  }

  // Auto-log when complete
  useEffect(() => {
    if (phase === "complete" && !completedRef.current) {
      completedRef.current = true;
      logComplete();
    }
  }, [phase]);

  function doBeep(f, d, v, type) { if (soundOn) beep(f, d, v, type); }
  function doSeq(tones)           { if (soundOn) beepSeq(tones); }

  function runInterval() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      timeRef.current--;
      const t   = timeRef.current;
      const ph  = phaseRef.current;
      if (ph === "paused") return;

      // ── Countdown beeps: last 3 seconds of ANY interval ──
      // Short harsh square-wave blips at 660 Hz, getting slightly louder each second
      if (t === 3) doBeep(660, 0.07, 0.16, "square");
      if (t === 2) doBeep(660, 0.07, 0.20, "square");
      if (t === 1) doBeep(660, 0.07, 0.24, "square");

      // ── Halfway tone: only during exercise intervals ──
      // Soft sine-wave reminder at the 30-second mark so you know you're halfway through
      if (ph === "exercise" && t === Math.floor(EXERCISE_TIME / 2)) {
        doBeep(528, 0.12, 0.14, "sine");
      }

      if (t <= 0) {
        if (ph === "prep") {
          // ── Prep complete → first exercise begins ──
          // Rising two-tone: signals "go!" clearly different from countdown blips
          doSeq([[440, 0.1, 0.25, "sine"], [660, 0.18, 0.30, "sine"]]);
          phaseRef.current = "exercise";
          setPhase("exercise");
          timeRef.current = EXERCISE_TIME;
          setTimeLeft(EXERCISE_TIME);

        } else if (ph === "exercise") {
          const next = setIdxRef.current + 1;
          if (next >= CIRCUIT_SIZE) {
            // ── Circuit complete: ascending three-note fanfare ──
            doSeq([[523, 0.12, 0.3, "sine"], [659, 0.12, 0.3, "sine"], [784, 0.35, 0.35, "sine"]]);
            clearInterval(intervalRef.current);
            releaseWakeLock();
            phaseRef.current = "complete";
            setPhase("complete");
            setTimeLeft(0);
            return;
          }
          // ── Exercise → rest: falling two-tone ("ease off") ──
          doSeq([[660, 0.1, 0.25, "sine"], [440, 0.18, 0.28, "sine"]]);
          setIdxRef.current = next;
          setSetIdx(next);
          phaseRef.current = "rest";
          setPhase("rest");
          timeRef.current = REST_TIME;
          setTimeLeft(REST_TIME);

        } else if (ph === "rest") {
          // ── Rest → exercise: rising two-tone ("go again") ──
          doSeq([[440, 0.1, 0.25, "sine"], [660, 0.18, 0.30, "sine"]]);
          phaseRef.current = "exercise";
          setPhase("exercise");
          timeRef.current = EXERCISE_TIME;
          setTimeLeft(EXERCISE_TIME);
        }
      } else {
        setTimeLeft(t);
      }
    }, 1000);
  }

  function startWorkout() {
    if (!hasWorkout) return;
    clearInterval(intervalRef.current);
    // Start with PREP phase — 10-second "get ready" countdown before first set
    phaseRef.current = "prep";
    setIdxRef.current = 0;
    timeRef.current = PREP_TIME;
    completedRef.current = false;
    setPhase("prep");
    setSetIdx(0);
    setTimeLeft(PREP_TIME);
    setTab("workout");
    // getAudioCtx() MUST be called here — inside the button-tap handler —
    // to unlock the AudioContext on iOS. All subsequent timer-based beeps
    // will reuse this same context and play correctly.
    getAudioCtx();
    // Distinct prep-start tone: three soft rising sine blips
    doSeq([[330, 0.08, 0.2, "sine"], [440, 0.08, 0.2, "sine"], [550, 0.12, 0.25, "sine"]]);
    requestWakeLock();
    runInterval();
  }

  function togglePause() {
    if (phaseRef.current === "paused") {
      phaseRef.current = prevPhaseRef.current;
      setPhase(prevPhaseRef.current);
      requestWakeLock();
      runInterval();
    } else if (["exercise","rest","prep"].includes(phaseRef.current)) {
      prevPhaseRef.current = phaseRef.current;
      clearInterval(intervalRef.current);
      releaseWakeLock();
      phaseRef.current = "paused";
      setPhase("paused");
    }
  }

  function stopWorkout() {
    clearInterval(intervalRef.current);
    releaseWakeLock();
    phaseRef.current = "idle";
    setPhase("idle");
    setSetIdx(0);
    setIdxRef.current = 0;
    timeRef.current = EXERCISE_TIME;
    setTimeLeft(EXERCISE_TIME);
  }

  function genWorkout(filterOverride) {
    // filterOverride lets quick-mode buttons bypass the current circuitFilter
    const activeFilter = filterOverride !== undefined ? filterOverride : circuitFilter;
    const pool = activeFilter === "All"
      ? exercises
      : exercises.filter(e => tagsOf(e).includes(activeFilter));
    if (pool.length === 0) {
      alert(`No exercises found with tag: ${activeFilter}. Add some in the Library tab first.`);
      return;
    }
    const sets = buildWorkout(pool);
    // Store which filter was used so the circuit card can show it
    saveTodayWorkout({ date: today, sets, filter: activeFilter });
    if (filterOverride !== undefined) saveCircuitFilter(filterOverride);
    stopWorkout();
    setTab("today");
  }

  function addExercise() {
    const name = newName.trim();
    if (!name) return;
    saveExercises(
      prev => [...prev, { id: `e${Date.now()}`, name, tags: [newCat], description: "" }],
      // onError callback: called if localStorage.setItem throws (e.g. quota exceeded)
      (err) => {
        setSaveMsg("error");
        setTimeout(() => setSaveMsg(""), 4000);
        console.error("addExercise save failed:", err);
      }
    );
    setNewName("");
    setSaveMsg("saved");
    setTimeout(() => setSaveMsg(""), 2000);
  }

  function removeExercise(id) {
    saveExercises(prev => prev.filter(e => e.id !== id));
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Calendar
  const now = new Date();
  const calDim  = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const calFdow = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  function getCalEntry(d) {
    const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return { date: ds, entry: stats.history.find(h => h.date === ds) };
  }

  const filteredEx = exercises.filter(e =>
    (filterCat === "All" || tagsOf(e).includes(filterCat)) &&
    e.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const progressPct = phase === "exercise" ? ((EXERCISE_TIME - timeLeft) / EXERCISE_TIME) * 100
    : phase === "rest" ? ((REST_TIME - timeLeft) / REST_TIME) * 100
    : phase === "prep" ? ((PREP_TIME - timeLeft) / PREP_TIME) * 100 : 0;

  function catCls(cat) {
    if (cat === "Kettlebell") return "badge kb";
    if (cat === "Bodyweight") return "badge bw";
    if (cat === "Core")       return "badge co";
    if (cat === "Cardio" || cat === "Strength") return "badge ot";
    // Anything not in the original five built-in categories is a
    // user-created custom tag — gets its own distinct teal styling
    // so it's visually obvious which tags are "yours"
    return "badge tg";
  }

  // Returns a valid access token, refreshing automatically if expired
  async function getValidStravaToken() {
    const sd = stravaData;
    if (!sd.accessToken) throw new Error("Not connected");
    const now = Math.floor(Date.now() / 1000);
    // Token still valid (with 5-minute buffer)
    if (sd.expiresAt - now > 300) return sd.accessToken;
    // Token expired — refresh it
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id:     sd.clientId,
        client_secret: sd.clientSecret,
        refresh_token: sd.refreshToken,
        grant_type:    "refresh_token",
      }),
    });
    if (!res.ok) throw new Error("Token refresh failed — please reconnect Strava");
    const data = await res.json();
    const updated = { ...sd, accessToken: data.access_token, refreshToken: data.refresh_token, expiresAt: data.expires_at };
    saveStravaData(updated);
    return data.access_token;
  }

  // Exchange the one-time auth code for access + refresh tokens
  async function exchangeStravaCode(code, sd) {
    setStravaConnecting(true);
    setStravaErr("");
    try {
      const res = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id:     sd.clientId,
          client_secret: sd.clientSecret,
          code,
          grant_type: "authorization_code",
        }),
      });
      if (!res.ok) throw new Error("Auth failed — check your Client ID and Secret");
      const data = await res.json();
      saveStravaData({
        clientId:     sd.clientId,
        clientSecret: sd.clientSecret,
        accessToken:  data.access_token,
        refreshToken: data.refresh_token,
        expiresAt:    data.expires_at,
      });
    } catch (e) {
      setStravaErr(e.message);
    } finally {
      setStravaConnecting(false);
    }
  }

  // Handle redirect-back from Strava (pendingCode detected on load)
  useEffect(() => {
    if (pendingCode && stravaData.clientId) {
      exchangeStravaCode(pendingCode, stravaData);
    }
  }, [pendingCode, stravaData.clientId]);

  // Redirect user to Strava to authorise
  function connectStrava() {
    const id = stravaSetupId.trim();
    const secret = stravaSetupSecret.trim();
    if (!id || !secret) { setStravaErr("Please enter both Client ID and Client Secret"); return; }
    // Save credentials first so they survive the redirect
    saveStravaData({ clientId: id, clientSecret: secret, accessToken: "", refreshToken: "", expiresAt: 0 });
    const redirectUri = window.location.origin + window.location.pathname;
    const url = `https://www.strava.com/oauth/authorize?client_id=${id}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=activity:write,read`;
    window.location.href = url;
  }

  async function postToStrava() {
    if (!stravaData.accessToken) return;
    setStravaErr("");
    setStravaPosted(false);
    try {
      const token = await getValidStravaToken();
      const elapsed = CIRCUIT_SIZE * (EXERCISE_TIME + REST_TIME);
      const res = await fetch("https://www.strava.com/api/v3/activities", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Activity #${totalCompleted}`,
          type: "WeightTraining",
          sport_type: "WeightTraining",
          start_date_local: new Date().toISOString(),
          elapsed_time: elapsed,
          description: `KB/BW Circuit · ${CIRCUIT_SIZE} sets · ${EXERCISE_TIME}s work/${REST_TIME}s rest\nDays missed in ${yearStr}: ${yearMissed} · Activities in ${yearStr}: ${yearCompleted}`,
        }),
      });
      if (res.ok) { setStravaPosted(true); }
      else {
        const errData = await res.json().catch(() => ({}));
        setStravaErr(errData.message || "Strava error — try reconnecting");
      }
    } catch (e) { setStravaErr(e.message || "Network error"); }
  }

  // ── Render ──────────────────────────────────────────────────────────────

  if (needsPin) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pin-overlay">
          <div className="pin-title">PARABOLA</div>
          <div className="pin-sub">ENTER PIN</div>
          <div className="pin-dots">
            {[0,1,2,3].map(i => (
              <div key={i} className={`pin-dot ${pinInput.length > i ? "filled" : ""}`} />
            ))}
          </div>
          {pinError && <div className="pin-err">INCORRECT PIN</div>}
          <div className="pin-grid">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k,i) => k === "" ? (
              <div key={i} />
            ) : (
              <button key={i} className="pin-key" onClick={() => {
                if (k === "⌫") setPinInput(p => p.slice(0,-1));
                else pressKey(k);
              }}>{k}</button>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* Header */}
        <div className="hdr">
          <div className="hdr-l">
            <div className="t">PARABOLA</div>
            <div className="s">{today}</div>
          </div>
          <div className="hdr-r">
            <div className="n">{totalCompleted}</div>
            <div className="s">TOTAL CIRCUITS</div>
          </div>
        </div>

        <div className="pg">

          {/* ── TODAY ── */}
          {tab === "today" && <>
            <div className="card">
              <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>
                Tap a number to edit
              </div>
              <div className="sg">
                {[
                  { key:"total",  v: totalCompleted, l: "All Time", base: stats.baseTotal  || 0, hist: histTotal  },
                  { key:"year",   v: yearCompleted,  l: yearStr,    base: stats.baseYear   || 0, hist: histYear   },
                  { key:"missed", v: yearMissed,     l: "Missed",   base: stats.baseMissed || 0, hist: histMissed },
                ].map(({key,v,l}) => (
                  <div key={key} className="sc" style={{cursor:"pointer",userSelect:"none"}}
                    onClick={() => { setEditingStat(key); setStatDraft(String(v)); }}>
                    {editingStat === key ? (
                      <input
                        type="number"
                        autoFocus
                        value={statDraft}
                        onChange={e => setStatDraft(e.target.value)}
                        onBlur={() => {
                          const parsed = parseInt(statDraft, 10);
                          if (!isNaN(parsed) && parsed >= 0) {
                            const baseKey = key === "total" ? "baseTotal" : key === "year" ? "baseYear" : "baseMissed";
                            const histVal = key === "total" ? histTotal : key === "year" ? histYear : histMissed;
                            saveStats(prev => ({ ...prev, [baseKey]: Math.max(0, parsed - histVal) }));
                          }
                          setEditingStat(null);
                        }}
                        onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingStat(null); }}
                        onClick={e => e.stopPropagation()}
                        style={{
                          fontFamily:"Bebas Neue,sans-serif",fontSize:36,color:"var(--ac2)",
                          background:"transparent",border:"none",borderBottom:"1px solid var(--ac2)",
                          outline:"none",width:"80%",textAlign:"center",lineHeight:1,
                        }}
                      />
                    ) : (
                      <div className="sv">{v}</div>
                    )}
                    <div className="sl">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {todayDone && <div className="done-banner">✓ Circuit Complete Today</div>}

            <div className="card">
              <div className="ct">Today's Circuit — {CIRCUIT_SIZE} Sets</div>

              {/* ── Tag filter chips — built-in categories + any custom tags ── */}
              <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>
                Filter pool
              </div>
              <div className="cftabs">
                {["All", ...allTags].map(c => {
                  const isOn = circuitFilter === c;
                  const isBW = c === "Bodyweight";
                  return (
                    <button
                      key={c}
                      className={`cftab ${isOn ? (isBW ? "bw-on" : "on") : ""}`}
                      onClick={() => saveCircuitFilter(c)}
                    >{c}</button>
                  );
                })}
              </div>

              {/* ── How many exercises available in pool ── */}
              {(() => {
                const poolSize = circuitFilter === "All"
                  ? exercises.length
                  : exercises.filter(e => tagsOf(e).includes(circuitFilter)).length;
                const isAll = circuitFilter === "All";
                const isBW  = circuitFilter === "Bodyweight";
                return (
                  <div className={`filter-badge ${isAll ? "" : isBW ? "bw-active" : "active"}`} style={{marginBottom:12}}>
                    <span>{isAll ? "●" : "◈"}</span>
                    <span>{isAll ? `All ${poolSize} exercises` : `${circuitFilter} only · ${poolSize} exercises`}</span>
                  </div>
                );
              })()}

              {/* ── Generate / Start buttons ── */}
              {!hasWorkout ? (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <button className="btn bp full" onClick={() => genWorkout()}>Generate Circuit</button>
                  {circuitFilter !== "Bodyweight" && (
                    <button className="btn bw-quick btn full bsm" onClick={() => genWorkout("Bodyweight")}>
                      ◈ Quick: Bodyweight Only
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Filter badge on existing circuit */}
                  {todayWorkout.filter && todayWorkout.filter !== "All" && (
                    <div className={`filter-badge ${todayWorkout.filter === "Bodyweight" ? "bw-active" : "active"}`} style={{marginBottom:8}}>
                      <span>◈</span>
                      <span>{todayWorkout.filter} circuit</span>
                    </div>
                  )}
                  {!todayDone && (
                    <button className="btn bp full" style={{marginBottom:8}} onClick={startWorkout}>▶ Start Workout</button>
                  )}
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    <button className="btn bg bsm" style={{flex:1}} onClick={() => genWorkout()}>
                      ↺ Regenerate
                    </button>
                    {circuitFilter !== "Bodyweight" && (
                      <button className="btn bw-quick bsm" style={{flex:1}} onClick={() => genWorkout("Bodyweight")}>
                        ◈ BW Only
                      </button>
                    )}
                  </div>
                  {todayWorkout.sets.map((ex, i) => (
                    <div key={i} className="xrow">
                      <span className="xn">{String(i+1).padStart(2,"0")}</span>
                      <span className="xnm">{ex.name}</span>
                      <span style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end",flexShrink:0}}>
                        {tagsOf(ex).map(tag => (
                          <span key={tag} className={catCls(tag)}>{tag}</span>
                        ))}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {!todayDone && (
              <div className="card">
                <div className="ct">Manual Log</div>
                <div className="row">
                  <button className="btn bs bsm" style={{flex:1}} onClick={logComplete}>✓ Log Complete</button>
                  <button className="btn bg bsm" style={{flex:1}} onClick={logMissed}>✗ Log Missed</button>
                </div>
              </div>
            )}
          </>}

          {/* ── WORKOUT ── */}
          {tab === "workout" && <>
            <button className="sound-btn" onClick={() => setSoundOn(s => !s)} style={{position:"relative",top:0,right:0,marginBottom:10,display:"block",marginLeft:"auto"}}>
              {soundOn ? "♪ ON" : "♪ OFF"}
            </button>

            {/* IDLE */}
            {phase === "idle" && (
              <div className="idle-ctr">
                <div className="idle-t">Ready to Begin?</div>
                {hasWorkout ? (
                  <button className="btn bp full" onClick={startWorkout}>▶ Begin Circuit</button>
                ) : (
                  <>
                    <div className="muted" style={{marginBottom:16}}>Generate a circuit first on the Today tab</div>
                    <button className="btn bs" onClick={() => setTab("today")}>← Today</button>
                  </>
                )}
              </div>
            )}

            {/* PREP — 10-second get-ready countdown */}
            {phase === "prep" && (
              <div className="tw">
                <div className="tph" style={{letterSpacing:6,color:"var(--ac2)"}}>· GET READY ·</div>
                {todayWorkout.filter && todayWorkout.filter !== "All" && (
                  <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--ac2)",textTransform:"uppercase",letterSpacing:2,textAlign:"center",marginBottom:4,opacity:0.7}}>
                    {todayWorkout.filter} circuit
                  </div>
                )}
                {todayWorkout.sets[0] && (
                  <div className="tex" style={{color:"var(--mu)",fontSize:28}}>
                    {todayWorkout.sets[0].name}
                  </div>
                )}
                <div
                  className={`tdig ${timeLeft <= 3 ? "pulse" : ""}`}
                  style={{color:"var(--ac2)"}}
                >
                  {timeLeft}
                </div>
                <div className="pb">
                  <div className="pf" style={{width:`${progressPct}%`,background:"var(--ac2)"}} />
                </div>
                <button className="btn bg full" onClick={stopWorkout}>✕ Cancel</button>
              </div>
            )}

            {/* COMPLETE */}
            {phase === "complete" && (
              <div className="comp">
                <div style={{fontFamily:"IBM Plex Mono",fontSize:10,color:"var(--mu)",letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Circuit Complete</div>
                <div className="comp-big">WELL<br/>DONE</div>
                <div className="comp-sub">{CIRCUIT_SIZE} sets · {Math.round(CIRCUIT_SIZE*(EXERCISE_TIME+REST_TIME)/60)} min</div>
                <div style={{fontFamily:"Bebas Neue",fontSize:22,color:"var(--gn)",letterSpacing:2,marginTop:16}}>
                  Activity #{totalCompleted} logged ✓
                </div>
                {/* Strava post — always shown when connected, regardless of how workout was logged */}
                <div style={{marginTop:20}}>
                  {stravaData.accessToken ? (
                    stravaPosted ? (
                      <div style={{color:"var(--sv)",fontFamily:"IBM Plex Mono",fontSize:11,letterSpacing:1}}>✓ Posted to Strava</div>
                    ) : (
                      <button className="btn bsv bsm" onClick={postToStrava}>⚡ Post to Strava</button>
                    )
                  ) : (
                    <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",letterSpacing:1}}>
                      Connect Strava in Stats tab to auto-log
                    </div>
                  )}
                  {stravaErr && <div style={{color:"var(--rd)",fontSize:11,marginTop:6,fontFamily:"IBM Plex Mono"}}>{stravaErr}</div>}
                </div>
                <div style={{marginTop:28}}>
                  <button className="btn bp full" onClick={() => { phaseRef.current="idle"; setPhase("idle"); setTab("today"); setStravaPosted(false); }}>
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE: exercise / rest / paused */}
            {(phase === "exercise" || phase === "rest" || phase === "paused") && currentEx && (
              <div className="tw">

                {/* Progress dots — one per set, larger than before */}
                <div className="dots">
                  {Array.from({length: CIRCUIT_SIZE}).map((_,i) => (
                    <div key={i} className={`dot ${i < setIdx ? "dn" : i === setIdx ? "cu" : ""}`} />
                  ))}
                </div>

                {/* Set counter — half the size of the exercise name text (20px vs 40px) */}
                <div style={{fontFamily:"IBM Plex Mono",fontSize:20,color:"var(--mu)",textAlign:"center",letterSpacing:2,marginBottom:4}}>
                  SET {setIdx+1} / {CIRCUIT_SIZE}
                </div>

                {/* Phase label */}
                <div className="tph">
                  {phase === "paused" ? "· PAUSED ·" : phase === "exercise" ? "▶ EXERCISE" : "◎ REST"}
                </div>

                {/* Main exercise name — large */}
                <div className="tex" style={{color: phase === "rest" ? "var(--ac2)" : "var(--tx)"}}>
                  {phase === "rest" ? "REST" : currentEx.name}
                </div>

                {/* Exercise description (if set, only during exercise) */}
                {phase === "exercise" && currentEx.description ? (
                  <div style={{fontFamily:"DM Sans",fontSize:12,color:"var(--mu)",textAlign:"center",marginTop:4,lineHeight:1.5,padding:"0 8px"}}>
                    {currentEx.description}
                  </div>
                ) : null}

                {/* NEXT exercise — 20px (half of 40px .tex), shown in both exercise and rest */}
                {phase === "rest" ? (
                  // During rest: currentEx IS the next exercise (setIdx already advanced)
                  <>
                    <div className="tnx" style={{color:"var(--ac)"}}>NEXT → {currentEx.name}</div>
                    {nextEx && (
                      <div className="tnx" style={{fontSize:16,color:"var(--mu)"}}>THEN → {nextEx.name}</div>
                    )}
                  </>
                ) : (
                  // During exercise: show upcoming exercises
                  <>
                    {nextEx && (
                      <div className="tnx" style={{color:"var(--mu)"}}>NEXT → {nextEx.name}</div>
                    )}
                    {afterEx && (
                      <div className="tnx" style={{fontSize:16,color:"var(--mu)",opacity:0.6}}>THEN → {afterEx.name}</div>
                    )}
                  </>
                )}

                {/* Timer digits */}
                <div
                  className={`tdig ${timeLeft <= 5 && phase !== "paused" ? "pulse" : ""}`}
                  style={{color: phase === "rest" ? "var(--ac2)" : phase === "paused" ? "var(--mu)" : "var(--tx)"}}
                >
                  {fmt(timeLeft)}
                </div>

                {/* Progress bar — 19px tall (~5mm), more visible across a room */}
                <div className="pb">
                  <div className="pf" style={{
                    width: `${progressPct}%`,
                    background: phase === "rest" ? "var(--ac2)" : "var(--ac)"
                  }} />
                </div>

                <div className="row">
                  <button className="btn bp" style={{flex:2}} onClick={togglePause}>
                    {phase === "paused" ? "▶ Resume" : "⏸ Pause"}
                  </button>
                  <button className="btn bg" style={{flex:1}} onClick={stopWorkout}>■ Stop</button>
                </div>
              </div>
            )}
          </>}

          {/* ── LIBRARY ── */}
          {tab === "library" && <>
            <div className="card">
              <div className="ct">Add Exercise</div>
              <input className="inp" placeholder="Exercise name..." value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addExercise()} />
              <div className="row" style={{marginBottom:8}}>
                <select className="sel" value={newCat} onChange={e => setNewCat(e.target.value)}>
                  {allTags.map(c => <option key={c}>{c}</option>)}
                </select>
                <button className="btn bp" onClick={addExercise}>+ Add</button>
              </div>
              {saveMsg === "saved" && (
                <div style={{fontFamily:"IBM Plex Mono",fontSize:11,color:"var(--gn)",letterSpacing:1,marginBottom:4}}>
                  ✓ Exercise saved to library
                </div>
              )}
              {saveMsg === "error" && (
                <div style={{fontFamily:"IBM Plex Mono",fontSize:11,color:"var(--rd)",letterSpacing:1,marginBottom:4,lineHeight:1.5}}>
                  ✗ Save failed — storage may be full. Try removing unused exercises.
                </div>
              )}
              <div className="muted" style={{fontSize:11}}>
                New exercises get this one tag to start — add more or change it any time below.
              </div>
            </div>

            {/* ── Manage Tags ── */}
            <div className="card">
              <div className="ct">Manage Tags</div>
              <div className="muted" style={{fontSize:12,marginBottom:10,lineHeight:1.6}}>
                Built-in tags (Kettlebell, Bodyweight, Core, Cardio, Strength) can't be removed.
                Custom tags you create can be deleted at any time — doing so removes them from any exercise that has them.
              </div>
              {customTags.length > 0 && (
                <div className="ftabs" style={{marginBottom:10}}>
                  {customTags.map(t => (
                    <span key={t} className="ftab on" style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"default",background:"rgba(80,180,200,.18)",borderColor:"#5fc7dd",color:"#5fc7dd"}}>
                      {t}
                      <span style={{cursor:"pointer",fontWeight:700}} onClick={() => removeCustomTag(t)}>✕</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="row">
                <input className="inp" placeholder="New tag name..." value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { addCustomTag(newTagInput); setNewTagInput(""); } }}
                  style={{marginBottom:0}} />
                <button className="btn bp" onClick={() => { addCustomTag(newTagInput); setNewTagInput(""); }}>+ Tag</button>
              </div>
            </div>

            <div className="card">
              <div className="ct">Library ({filteredEx.length} / {exercises.length})</div>
              <input className="inp" placeholder="Search..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              <div className="ftabs">
                {["All", ...allTags].map(c => (
                  <button key={c} className={`ftab ${filterCat===c?"on":""}`} onClick={() => setFilterCat(c)}>{c}</button>
                ))}
              </div>
              {filteredEx.length === 0 && <div className="muted" style={{padding:"8px 0"}}>No exercises found</div>}
              {filteredEx.map(ex => (
                <ExerciseRow key={ex.id} ex={ex} catCls={catCls} allTags={allTags}
                  onRemove={() => removeExercise(ex.id)}
                  onDescChange={(desc) => saveExercises(prev => prev.map(e => e.id===ex.id ? {...e, description:desc} : e))}
                  onToggleTag={(tag) => toggleExerciseTag(ex.id, tag)}
                />
              ))}
            </div>
          </>}

          {/* ── STATS ── */}
          {tab === "stats" && <>
            <div className="card">
              <div className="ct">Performance</div>
              {[
                { l: "Total circuits completed",    v: totalCompleted },
                { l: `Circuits in ${yearStr}`,       v: yearCompleted  },
                { l: `Days missed in ${yearStr}`,    v: yearMissed     },
                { l: "Exercises in library",         v: exercises.length },
              ].map(({l,v}) => (
                <div key={l} className="sr">
                  <span className="srl">{l}</span>
                  <span className="srv">{v}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="ct">{MONTH_NAMES[now.getMonth()]} {now.getFullYear()}</div>
              <div className="cal">
                {["M","T","W","T","F","S","S"].map((d,i) => (
                  <div key={`h${i}`} className="cd hd" style={{fontSize:8,color:"var(--mu)"}}>{d}</div>
                ))}
                {Array.from({length:calFdow}).map((_,i) => (
                  <div key={`p${i}`} className="cd hd" />
                ))}
                {Array.from({length:calDim}).map((_,i) => {
                  const d = i+1;
                  const {date, entry} = getCalEntry(d);
                  return (
                    <div key={d} className={`cd ${entry?.completed?"dn":entry?"ms":""} ${date===today?"td":""}`}>
                      {d}
                    </div>
                  );
                })}
              </div>
              <div className="cal-leg">
                <span><span style={{color:"var(--ac)"}}>■</span> Done</span>
                <span><span style={{color:"var(--rd)"}}>■</span> Missed</span>
                <span><span style={{color:"var(--ac2)"}}>□</span> Today</span>
              </div>
            </div>

            {/* Strava */}
            <div className="card strava-card">
              <div className="ct strava-title">⚡ Strava</div>

              {stravaConnecting && (
                <div style={{fontFamily:"IBM Plex Mono",fontSize:11,color:"var(--ac2)",marginBottom:10,letterSpacing:1}}>
                  ◎ Completing connection…
                </div>
              )}

              {!stravaConnecting && stravaData.accessToken ? (
                /* ── Connected state ── */
                <>
                  <div className="strava-connected">✓ Connected · auto-refresh enabled</div>
                  <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",marginBottom:10,letterSpacing:1}}>
                    Token refreshes automatically · never expires
                  </div>
                  <div className="row">
                    <button className="btn bsv bsm" style={{flex:1}} onClick={postToStrava}>
                      Post Today's Circuit
                    </button>
                    <button className="btn bg bsm" onClick={() => {
                      saveStravaData({ clientId:"", clientSecret:"", accessToken:"", refreshToken:"", expiresAt:0 });
                      setStravaPosted(false); setStravaErr("");
                    }}>Disconnect</button>
                  </div>
                  {stravaPosted && <div style={{color:"var(--gn)",fontFamily:"IBM Plex Mono",fontSize:10,marginTop:6,letterSpacing:1}}>✓ Activity posted to Strava</div>}
                  {stravaErr   && <div style={{color:"var(--rd)",fontFamily:"IBM Plex Mono",fontSize:10,marginTop:6}}>{stravaErr}</div>}
                </>
              ) : !stravaConnecting && !stravaData.clientId ? (
                /* ── Setup state: enter credentials ── */
                <>
                  <div className="muted" style={{fontSize:12,lineHeight:1.7,marginBottom:12}}>
                    Enter your Strava API credentials to connect. You only do this once — tokens refresh automatically forever after.
                  </div>
                  <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>
                    Client ID
                  </div>
                  <input className="inp" type="text" inputMode="numeric" placeholder="e.g. 12345"
                    value={stravaSetupId} onChange={e => setStravaSetupId(e.target.value)} />
                  <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"var(--mu)",letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>
                    Client Secret
                  </div>
                  <input className="inp" type="password" placeholder="long alphanumeric string"
                    value={stravaSetupSecret} onChange={e => setStravaSetupSecret(e.target.value)} />
                  <button className="btn bsv full bsm" style={{marginTop:4}} onClick={connectStrava}>
                    Connect with Strava →
                  </button>
                  {stravaErr && <div style={{color:"var(--rd)",fontFamily:"IBM Plex Mono",fontSize:10,marginTop:6}}>{stravaErr}</div>}
                  <div className="strava-note">
                    Find your Client ID and Secret at strava.com/settings/api after creating an API application. You will be redirected to Strava to authorise, then returned here automatically.
                  </div>
                </>
              ) : !stravaConnecting && stravaData.clientId && !stravaData.accessToken ? (
                /* ── Has credentials but not yet authorised (e.g. disconnect then reconnect) ── */
                <>
                  <div className="muted" style={{fontSize:12,lineHeight:1.7,marginBottom:10}}>
                    Credentials saved. Tap below to authorise with Strava.
                  </div>
                  <button className="btn bsv full bsm" onClick={() => {
                    setStravaSetupId(stravaData.clientId);
                    setStravaSetupSecret(stravaData.clientSecret);
                    connectStrava();
                  }}>
                    Authorise with Strava →
                  </button>
                  <button className="btn bg bsm" style={{marginTop:6,width:"100%"}} onClick={() =>
                    saveStravaData({ clientId:"", clientSecret:"", accessToken:"", refreshToken:"", expiresAt:0 })
                  }>Clear & start over</button>
                  {stravaErr && <div style={{color:"var(--rd)",fontFamily:"IBM Plex Mono",fontSize:10,marginTop:6}}>{stravaErr}</div>}
                </>
              ) : null}
            </div>

            {/* Privacy / PIN */}
            <div className="card">
              <div className="ct">Privacy</div>
              {pin ? (
                <div className="settings-row">
                  <span className="settings-lbl">PIN protection</span>
                  <button className="btn bg bsm" onClick={() => savePin("")}>Remove PIN</button>
                </div>
              ) : (
                <>
                  <div className="muted" style={{fontSize:12,marginBottom:8}}>Set a 4-digit PIN to lock the app on load.</div>
                  <div className="row">
                    <input className="inp" type="number" placeholder="New PIN (4 digits)"
                      maxLength={4} value={settingPin} onChange={e => setSettingPin(e.target.value.slice(0,4))}
                      style={{margin:0}} />
                    <button className="btn bp bsm" onClick={() => { if(settingPin.length===4){savePin(settingPin);setSettingPin("");} }}>
                      Set
                    </button>
                  </div>
                </>
              )}
            </div>
          </>}

        </div>

        {/* Tab bar */}
        <div className="tabs">
          {[
            { id:"today",   ic:"◈", l:"Today"   },
            { id:"workout", ic:"▶", l:"Workout"  },
            { id:"library", ic:"≡", l:"Library"  },
            { id:"stats",   ic:"◎", l:"Stats"    },
          ].map(t => (
            <button key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={() => setTab(t.id)}>
              <span className="tab-ic">{t.ic}</span>
              {t.l}
            </button>
          ))}
        </div>

      </div>
    </>
  );
}

// ── Error Boundary ──────────────────────────────────────────────────────
// React Error Boundaries MUST be class components — this is one of the few
// remaining cases where a class is required even in modern React, because
// the catching mechanism (getDerivedStateFromError / componentDidCatch) only
// exists on the class component lifecycle, not in hooks.
//
// Without this, ANY uncaught error during rendering (a bad CDN version, a
// genuine bug, corrupted stored data, etc.) crashes the entire React tree
// silently, leaving a blank white screen with no clue why. This catches
// that and shows a readable message instead.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Parabola crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: {
          fontFamily: "IBM Plex Mono, monospace",
          background: "#0d0d0b",
          color: "#eeebe2",
          minHeight: "100vh",
          padding: "32px 20px",
          maxWidth: 430,
          margin: "0 auto",
          boxSizing: "border-box",
        }
      },
        React.createElement('div', { style: { fontFamily: "Bebas Neue, sans-serif", fontSize: 32, color: "#e05c1a", letterSpacing: 2, marginBottom: 16 } }, "SOMETHING WENT WRONG"),
        React.createElement('p', { style: { fontSize: 13, color: "#a8a59c", lineHeight: 1.6, marginBottom: 16 } },
          "Parabola hit an error while loading. This is usually caused by an external script (React, Babel) changing version, or corrupted saved data. Try reloading first."),
        React.createElement('div', {
          style: { background: "#1c1c19", border: "1px solid #272723", borderRadius: 4, padding: 12, fontSize: 11, color: "#d95050", marginBottom: 20, wordBreak: "break-word" }
        }, String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)),
        React.createElement('button', {
          style: { background: "#e05c1a", color: "white", border: "none", borderRadius: 2, padding: "12px 20px", fontFamily: "IBM Plex Mono, monospace", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", width: "100%", cursor: "pointer" },
          onClick: () => window.location.reload()
        }, "Reload App")
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
