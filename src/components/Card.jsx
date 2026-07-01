function Card({ children }) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-lg
        p-8
        hover:shadow-2xl
        transition
      "
    >
      {children}
    </div>
  );
}

export default Card;