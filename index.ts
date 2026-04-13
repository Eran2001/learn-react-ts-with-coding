type UserID = (id: number) => string;

const userID: UserID = function (id: number) {
  return "Hello";
};

console.log((userID as Function)(1));

console.log(userID(1));
