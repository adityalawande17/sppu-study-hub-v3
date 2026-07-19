const modules = import.meta.glob("../data/subjects/**/*.json", { eager: true });

const subjectFiles = {};
for (const path in modules) {
  const data = modules[path].default;
  if (data?.code) {
    subjectFiles[data.code] = data;
  } else {
    const fileName = path.split("/").pop().replace(".json", "");
    subjectFiles[fileName] = data;
  }
}

export function getSubjectContent(code) {
  return subjectFiles[code] ?? null;
}
