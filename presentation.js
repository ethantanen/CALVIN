conversation = {
  callword: 'send email',
  questions: [[key1, question1], ['recipient', 'who would you like to email?'],...],
  answers: { //begins empty
    key1: answer1,
    'recipient': 'ethantanen@yahoo.com',
  },
  current: 0// pointer to current question
  next: () => {},// prompt next question
  previous: () => {} // move current index back one and reprompt question
  fulfill: () => {}, // fulfill the conversations intent,
                     //reference answers like this.answers.email
}


{text: <String>}

{text: <String>}
