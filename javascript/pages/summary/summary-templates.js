"use strict";

function getsummaryTemplate(params) {
  return ` <div class="cardSection">
            <div class="pageHeaderWrapper">
              <div class="pageHeader">
                <h1 class="pageTitle">Join 360</h1>
                <div class="pageSubtitle">Key Matrics at a Glance</div>
              </div>
            </div>
            <div class="cardRowsWrapper">
              <div class="cardRow topRow">
                <div class="card">
                  <div class="cardMainContent">
                    <div class="cardIcon">
                      <img
                        src="../assets/icons/summary and sideboard/pencil.svg"
                        alt=""
                      />
                    </div>
                    <div class="cardValueLabelGroup">
                      <div class="cardValue" id="todoCounter">1</div>
                      <div class="cardLabel">To Do</div>
                    </div>
                  </div>
                </div>

                <div class="card">
                  <div class="cardMainContent">
                    <div class="cardIcon">
                      <img
                        src="../assets/icons/summary and sideboard/check.svg"
                        alt=""
                      />
                    </div>
                    <div class="cardValueLabelGroup">
                      <div class="cardValue" id="doneCounter"></div>
                      <div class="cardLabel">Done</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cardRow">
                <div class="card combinedCard">
                  <div class="cardContent">
                    <div class="urgentSection">
                      <div class="cardMainContent">
                        <div class="urgentCardIcon">
                          <img
                            src="../assets/icons/summary and sideboard/urgent.svg"
                            alt=""
                          />
                        </div>
                        <div class="cardValueLabelGroup">
                          <div class="cardValue" id="highPriorityCounter"></div>
                          <div class="cardLabel">Urgent</div>
                        </div>
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="dateSection">
                      <div class="dateTitle" id="dueDateCounter"></div>
                      <div class="dateSubtitle">Upcoming Deadline</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cardRow bottomRow">
                <div class="card largeCard">
                  <div class="cardValue" id="boardCounter">5</div>
                  <div class="cardLabel">Tasks in<br />Board</div>
                </div>

                <div class="card largeCard">
                  <div class="cardValue" id="inProgressCounter"></div>
                  <div class="cardLabel">Tasks in<br />Progress</div>
                </div>

                <div class="card largeCard">
                  <div class="cardValue" id="awaitFeedbackCounter"></div>
                  <div class="cardLabel">Awaiting<br />Feedback</div>
                </div>
              </div>
            </div>
          </div>
          <div class="welcomeSection welcomeSectionSplit">
            <div class="welcomeText" id="welcomeText"></div>
            <div class="userName" id="userName"></div>
          </div>
        </div>  `;
}

function getSuccessSignUpMessageTempalte() {
  return `
    <div id="signUpSuccess" class="signUpSuccessMessage">
      <div class="signUpSuccessContent">
        <img src="../assets/icons/shared/check.svg" alt="Success">
        <span>You Signed Up successfully</span>
      </div>
    </div>
  `;
}
