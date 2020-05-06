import gravatar from "../../utils/gravatar";

test("Gravatar Function test", () => {
  const email = "diego.camino.r@gmail.com";
  const gravatarUrl =
    "https://gravatar.com/avatar/248c438271d1b1940818dae0187ebf49";
  expect(gravatarUrl).toEqual(gravatar(email));
});
