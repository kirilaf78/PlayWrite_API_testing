// load Playwrite module

import { test, expect, APIResponse } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
// write a test

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

interface PostAPIResponseBody {
  booking: Booking;
}
test("Create POST API request using dynamic request body in Playwright", async ({
  request,
}) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int(1000);
  const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
  const checkOutDate = DateTime.now().plus({day: 5}).toFormat('yyyy-MM-dd');
  // Create POST API request using Playwright
  const postAPIResponse: APIResponse = await request.post("/booking", {
    data: {
      firstname: firstName,
      lastname: lastName,
      totalprice: totalPrice,
      depositpaid: true,
      bookingdates: {
        checkin: checkInDate,
        checkout: checkOutDate,
      },
      additionalneeds: "super bowls",
    },
  });

  // Validate status code
  const postAPIResponseBody: PostAPIResponseBody = await postAPIResponse.json();

  console.log(postAPIResponseBody);

  // Check if the response was OK and has the correct status
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // Validate API response json object
  expect(postAPIResponseBody.booking).toHaveProperty(
    "firstname",
    firstName
  );
  expect(postAPIResponseBody.booking).toHaveProperty(
    "lastname",
    lastName
  );

  // Validate API response nested json object (bookingdates)
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    checkInDate
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    checkOutDate
  );
});
