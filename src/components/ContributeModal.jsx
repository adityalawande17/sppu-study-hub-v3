export default function ContributeModal({ open, onClose }) {
  if (!open) return null;
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSfU-ODbKRwF-5kpThogiLVHKcOWggi3lVJDDnoP3eBHo33nmw/viewform?usp=sharing&ouid=102365635652061337866",
    "_blank",
  );
  onClose();
  return null;
}
