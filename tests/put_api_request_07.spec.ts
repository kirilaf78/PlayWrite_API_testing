import { test, expect, APIResponse } from "@playwright/test";
import bookingAPIRequestBody from "../test-data/post_dynamic_request_body.json";
import { stringFormat } from "../utils/common";
import tokenRequestBody from "../test-data/put_request_body.json";

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
  bookingid: number;
  booking: Booking;
}

test("Create PUT API request in Playwright", async ({ request }) => {
  const dynamicRequestBody = stringFormat(
    JSON.stringify(bookingAPIRequestBody),
    "cypress",
    "js",
    "apple"
  );
  console.log(dynamicRequestBody);

  // Create POST API request using Playwright with JSON file data
  const postAPIResponse: APIResponse = await request.post("/booking", {
    data: JSON.parse(dynamicRequestBody),
  });

  // Validate the status code
  const postAPIResponseBody: PostAPIResponseBody = await postAPIResponse.json();

  console.log(postAPIResponseBody);
  const bId = postAPIResponseBody.bookingid;

  // Check if the response was OK and has the correct status
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // Validate API response JSON object
  expect(postAPIResponseBody.booking).toHaveProperty("firstname", "cypress");
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", "js");
  expect(postAPIResponseBody.booking).toHaveProperty(
    "additionalneeds",
    "apple"
  );

  // Validate API response nested JSON object (bookingdates)
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2018-01-01"
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkout",
    "2019-01-01"
  );

  //Get API call
  console.log("======================================");
  const getAPIResponse = await request.get(`/booking/${bId}`);
  console.log(await getAPIResponse.json());
  //Validate status code
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
  console.log("======================================");
  // Generate token
  const tokenResponse = await request.post(`/auth`, {
    data: tokenRequestBody,
  });
  const tokenAPIResponseBody = await tokenResponse.json();

  console.log(tokenAPIResponseBody);
  const tokenNo = tokenAPIResponseBody.token
  console.log(tokenNo)

  // PUT API call
});
