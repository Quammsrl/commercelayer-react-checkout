import { internet } from "faker"

import { euAddress } from "../support/utils"

describe("Checkout Shipments", () => {
  const filename = "shipments"
  const redirectUrl = internet.url()

  const email = internet.email().toLocaleLowerCase()
  const password = internet.password()

  before(function () {
    cy.createCustomer({ email: email, password: password }).then(() => {
      cy.getTokenCustomer({
        username: email,
        password: password,
      }).as("tokenObj")
    })
  })

  context("order with one shipment not selected", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(order.id, address.id, this.tokenObj.access_token)
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select Standard Shipping and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@retrieveLineItems",
        "@getOrderShipments",
      ])
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Standard Shipping"
      )
    })

    it("edit Delivery, select Express Delivery and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@retrieveLineItems",
        "@getOrderShipments",
      ])
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Express Delivery"
      )
    })
  })

  context("order with two shipments not selected", () => {
    before(function () {
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
          })
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "5",
              sku_code: "BABYONBU000000E63E7412MX",
            },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(order.id, address.id, this.tokenObj.access_token)
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("select Standard Shipping to both shipments and save", () => {
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.get("@shippingMethodButton2").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@retrieveLineItems",
        "@getOrderShipments",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Standard Shipping"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Standard Shipping"
      )
    })

    it("edit Delivery, select Express Delivery to both shipments and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.get("@shippingMethodButton3").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@retrieveLineItems",
        "@getOrderShipments",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Express Delivery"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Express Delivery"
      )
    })

    it("edit Delivery, select Express Delivery to first shipment and select Standard Shipping to second shipment and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton1").click()
      cy.wait("@retrieveLineItems")
      cy.get("@shippingMethodButton2").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@retrieveLineItems",
        "@getOrderShipments",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Express Delivery"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Standard Shipping"
      )
    })

    it("edit Delivery, select Standard Shipping to first shipment and select Express Delivery to second shipment and save", () => {
      cy.dataCy("step_shipping")
        .click()
        .should("have.attr", "data-status", "true")
      cy.wait("@retrieveLineItems")
      cy.dataCy("shipping-method-button").each((e, i) => {
        cy.wrap(e).as(`shippingMethodButton${i}`)
      })
      cy.get("@shippingMethodButton0").click()
      cy.wait("@retrieveLineItems")
      cy.get("@shippingMethodButton3").click()
      cy.wait([
        "@retrieveLineItems",
        "@getOrders",
        "@getShipments",
        "@getOrderShipments",
      ])
      cy.dataCy("save-shipments-button").click()
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
        "@retrieveLineItems",
        "@getOrderShipments",
      ])
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Standard Shipping"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Express Delivery"
      )
    })
  })

  context("order with a Standard Shipping", () => {
    before(function () {
      console.log(email, password)
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(
              order.id,
              address.id,
              this.tokenObj.access_token
            ).then(() => {
              cy.getShipments({
                accessToken: this.tokenObj.access_token,
                orderId: order.id,
              }).then((shipments) => {
                cy.setShipmentMethod({
                  type: "Standard Shipping",
                  id: shipments[0].id,
                  accessToken: this.tokenObj.access_token,
                })
              })
            })
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Standard Shipping", () => {
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Standard Shipping"
      )
    })
  })

  context("order with a Express Delivery EU", () => {
    before(function () {
      console.log(email, password)
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "1",
              sku_code: "CANVASAU000000FFFFFF1824",
            },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(
              order.id,
              address.id,
              this.tokenObj.access_token
            ).then(() => {
              cy.getShipments({
                accessToken: this.tokenObj.access_token,
                orderId: order.id,
              }).then((shipments) => {
                cy.setShipmentMethod({
                  type: "Express Delivery EU",
                  id: shipments[0].id,
                  accessToken: this.tokenObj.access_token,
                })
              })
            })
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Express Delivery", () => {
      cy.dataCy("shipping-method-name-recap").should(
        "contain.text",
        "Express Delivery"
      )
    })
  })

  context("order with 2 shipments both Standard Shipping", () => {
    before(function () {
      console.log(email, password)
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
          })
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "5",
              sku_code: "BABYONBU000000E63E7412MX",
            },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(
              order.id,
              address.id,
              this.tokenObj.access_token
            ).then(() => {
              cy.getShipments({
                accessToken: this.tokenObj.access_token,
                orderId: order.id,
              }).then((shipments) => {
                cy.setShipmentMethod({
                  type: "Standard Shipping",
                  id: shipments[0].id,
                  accessToken: this.tokenObj.access_token,
                })
                cy.setShipmentMethod({
                  type: "Standard Shipping",
                  id: shipments[1].id,
                  accessToken: this.tokenObj.access_token,
                })
              })
            })
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Standard Shipping", () => {
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Standard Shipping"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Standard Shipping"
      )
    })
  })

  context("order with 2 shipments both Express Delivery EU", () => {
    before(function () {
      console.log(email, password)
      cy.createOrder("draft", {
        languageCode: "en",
        customerEmail: email,
        accessToken: this.tokenObj.access_token,
      })
        .as("newOrder")
        .then((order) => {
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: { quantity: "1", sku_code: "CANVASAU000000FFFFFF1824" },
          })
          cy.createSkuLineItems({
            orderId: order.id,
            accessToken: this.tokenObj.access_token,
            attributes: {
              quantity: "5",
              sku_code: "BABYONBU000000E63E7412MX",
            },
          })
          cy.createAddress({
            ...euAddress,
            accessToken: this.tokenObj.access_token,
          }).then((address) => {
            cy.setSameAddress(
              order.id,
              address.id,
              this.tokenObj.access_token
            ).then(() => {
              cy.getShipments({
                accessToken: this.tokenObj.access_token,
                orderId: order.id,
              }).then((shipments) => {
                cy.setShipmentMethod({
                  type: "Express Delivery EU",
                  id: shipments[0].id,
                  accessToken: this.tokenObj.access_token,
                })
                cy.setShipmentMethod({
                  type: "Express Delivery EU",
                  id: shipments[1].id,
                  accessToken: this.tokenObj.access_token,
                })
              })
            })
          })
        })
    })

    beforeEach(function () {
      cy.setRoutes({
        endpoint: Cypress.env("apiEndpoint"),
        routes: Cypress.env("requests"),
        record: Cypress.env("record"), // @default false
        filename,
      })
    })

    after(() => {
      if (Cypress.env("record")) {
        cy.saveRequests(filename)
      }
    })

    it("valid customer token", function () {
      cy.visit(
        `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
      )
      cy.wait([
        "@getOrders",
        "@retrieveLineItems",
        "@getShippingMethods",
        "@getOrderShipments",
      ])
      cy.url().should("contain", this.tokenObj.access_token)
      cy.url().should("not.contain", Cypress.env("accessToken"))
    })

    it("check both Express Delivery", () => {
      cy.dataCy("shipping-method-name-recap").each((e, i) => {
        cy.wrap(e).as(`shippingMethodNameRecap${i}`)
      })
      cy.get("@shippingMethodNameRecap0").should(
        "contain.text",
        "Express Delivery"
      )
      cy.get("@shippingMethodNameRecap1").should(
        "contain.text",
        "Express Delivery"
      )
    })
  })

  context(
    "order with 2 shipments: Standard Shipping and Express Delivery EU",
    () => {
      before(function () {
        console.log(email, password)
        cy.createOrder("draft", {
          languageCode: "en",
          customerEmail: email,
          accessToken: this.tokenObj.access_token,
        })
          .as("newOrder")
          .then((order) => {
            cy.createSkuLineItems({
              orderId: order.id,
              accessToken: this.tokenObj.access_token,
              attributes: {
                quantity: "1",
                sku_code: "CANVASAU000000FFFFFF1824",
              },
            })
            cy.createSkuLineItems({
              orderId: order.id,
              accessToken: this.tokenObj.access_token,
              attributes: {
                quantity: "5",
                sku_code: "BABYONBU000000E63E7412MX",
              },
            })
            cy.createAddress({
              ...euAddress,
              accessToken: this.tokenObj.access_token,
            }).then((address) => {
              cy.setSameAddress(
                order.id,
                address.id,
                this.tokenObj.access_token
              ).then(() => {
                cy.getShipments({
                  accessToken: this.tokenObj.access_token,
                  orderId: order.id,
                }).then((shipments) => {
                  cy.setShipmentMethod({
                    type: "Standard Shipping",
                    id: shipments[0].id,
                    accessToken: this.tokenObj.access_token,
                  })
                  cy.setShipmentMethod({
                    type: "Express Delivery EU",
                    id: shipments[1].id,
                    accessToken: this.tokenObj.access_token,
                  })
                })
              })
            })
          })
      })

      beforeEach(function () {
        cy.setRoutes({
          endpoint: Cypress.env("apiEndpoint"),
          routes: Cypress.env("requests"),
          record: Cypress.env("record"), // @default false
          filename,
        })
      })

      after(() => {
        if (Cypress.env("record")) {
          cy.saveRequests(filename)
        }
      })

      it("valid customer token", function () {
        cy.visit(
          `/?accessToken=${this.tokenObj.access_token}&orderId=${this.newOrder.id}&redirectUrl=${redirectUrl}`
        )
        cy.wait([
          "@getOrders",
          "@retrieveLineItems",
          "@getShippingMethods",
          "@getOrderShipments",
        ])
        cy.url().should("contain", this.tokenObj.access_token)
        cy.url().should("not.contain", Cypress.env("accessToken"))
      })

      it("check shipments: Standard Shipping and Express Delivery", () => {
        cy.dataCy("shipping-method-name-recap").each((e, i) => {
          cy.wrap(e).as(`shippingMethodNameRecap${i}`)
        })
        cy.get("@shippingMethodNameRecap0").should(
          "contain.text",
          "Standard Shipping"
        )
        cy.get("@shippingMethodNameRecap1").should(
          "contain.text",
          "Express Delivery"
        )
      })
    }
  )
})
