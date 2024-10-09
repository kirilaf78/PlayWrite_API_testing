import { test, expect, APIResponse } from '@playwright/test';
import bookingAPIRequestBody from '../test-data/post_dynamic_request_body.json';
import { stringFormat } from '../utils/common';

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

test("Create POST API request using dynamic JSON file in Playwright", async ({ request }) => {
 const dynamicRequestBody = stringFormat(JSON.stringify(bookingAPIRequestBody), "cypress", "js", "apple");
 console.log(dynamicRequestBody)

  // Create POST API request using Playwright with JSON file data
  const postAPIResponse: APIResponse = await request.post('/booking', {
    data: JSON.parse(dynamicRequestBody)
  });

  // Validate the status code
  const postAPIResponseBody: PostAPIResponseBody = await postAPIResponse.json();

  console.log(postAPIResponseBody);

  // Check if the response was OK and has the correct status
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // Validate API response JSON object
  expect(postAPIResponseBody.booking).toHaveProperty(
    'firstname',
    'cypress'
  );
  expect(postAPIResponseBody.booking).toHaveProperty(
    'lastname',
    'js'
  );
  expect(postAPIResponseBody.booking).toHaveProperty(
    'additionalneeds',
    'apple'
  );

  // Validate API response nested JSON object (bookingdates)
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    'checkin',
    '2018-01-01'
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    'checkout',
    '2019-01-01'
  );
});
