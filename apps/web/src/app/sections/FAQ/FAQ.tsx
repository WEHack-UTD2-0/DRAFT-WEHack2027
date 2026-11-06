import React from 'react'
import './FAQ.css'
import Question from '@/components/Question/Question'

function FAQ() {
  return (
    <div className='FAQ-container w-full h-auto flex flex-wrap flex-col items-center justify-center p-6 pb-40 lg:pb-24 pt-20' id="FAQ">
        
        <div className="title-container flex flex-col">      
            <div className="header-container pb-1 md:pb-1 lg:pb-2 flex flex-col md:flex-row gap-x-10">
                <div className="flex justify-start pb-2 -ml-8">
                    <img src="img/static/images/FAQ.webp" className="h-auto w-full max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px]"></img>
                </div>
            </div>
        </div>

        <div className='drop-down-container gap-0 mt-3 lg:-mt-8 lg:gap-0 lg:px-14'>
            <div className='column-right w-full lg:w-2/2'>
                <div className='questions-container flex flex-col items-stretch justify-start gap-0 w-full'>
                    {dataColOne.map((FAQ, index) => (
                        <div className='flex flex-wrap items-center justify-center w-full' key={index}>
                            <Question number={index + 1} question={FAQ.question} answer={FAQ.answer}/>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>

        <div className="vinyl-blue-container flex justify-center md:justify-end lg:justify-end md:-ml-[10rem] lg:-ml-[25rem] xl:-ml-[45rem] pt-20 pb-72 md:pt-16 md:pb-72">
            <img className="vinyl" src="img/static/images/minutes1 2 (2).png" width="300px" height="300px"></img>    
        </div>
        
        
        
    </div>
  )
}

const dataColOne = [
    {
        question: "Who can attend?",
        answer: "Anyone can sign up to participate as a hacker at WEHack. However, keep in mind that a lot of the hackathon content will revolve around women and non-binary experiences to reflect our mission of uniting and empowering women and non-binary individuals in STEM. If you do not identify as female or non-binary but consider yourself an ally of our cause, we would love to have you as a mentor or volunteer!",
    },

    {
        question: "When and where is WEHack?",
        answer: "WEHack 2027 will be held in person in the Engineering and Computer Science West (ECSW) building at the University of Texas at Dallas. WEHack 2026 will be from April 11-12th!",
    },

    {
        question: "Do I need to have coding experience?",
        answer: "No! WEHack is open to all majors and experience levels and would be the perfect place to work on your first project. Resources such as mentors and workshops are available to support beginner hackers.",
    },
    
    {
        question: "How do I apply?",
        answer: "Hackers can register via the link at the top of the page. Mentor and volunteer applications will be posted soon! Registration for WEHack 2026 will be released in December 2025.",
    },

    {
        question: "Can I participate if I am in high school?",
        answer: "Unfortunately, we are not able to accommodate anyone below the age of 18 at this time.",
    },

    {
        question: "Can I work on my project before WEHack?",
        answer: "All projects must be started at WEHack, but you are free to brainstorm project ideas prior to the hackathon. Projects can range from solving personal or social challenges to solving hackathon or sponsor challenges.",
    },

    {
        question: "Does it cost money to participate?",
        answer: "WEHack 2026 is completely free! This includes food and swag, which will be handed out to attendees during the hackathon.",
    },

    {
        question: "How do teams work at WEHack?",
        answer: "Teams at WEHack can have up to 4 members. If you do not have a team, don’t worry! You can either work individually or form teams the day of the hackathon by meeting fellow hackers on the Discord or during team building events.",
    },

    {
        question: "When does registration close?",
        answer: "Registration deadlines will be announced soon.",
    },

    {
        question: "Will hardware be available?",
        answer: "WEHack will be providing hardware, and we encourage you to use online hardware simulators.",
    },

    {
        question: "What are the meal options offered?",
        answer: "We will provide food for meat, vegetarian, vegan, gluten-free, and halal diets.",
        
    },

    {
        question: "Can I sleep at WEHack?",
        answer: "You are welcome to sleep at WEHack! Make sure to bring pillows, blankets, chargers, and other necessities if you are planning to stay the night.",        
    }

]

// const dataColTwo =  [
//     {
//         question: "Does it cost money to participate?",
//         answer: "WEHack 2024 is completely free! This includes food and swag, which will be handed out to attendees during the hackathon.",
//     },

//     {
//         question: "How do teams work at WEHack?",
//         answer: "Teams at WEHack can have up to 4 members. If you do not have a team, don’t worry! You can either work individually or form teams the day of the hackathon by meeting fellow hackers on the Discord or during team building events.",
//     },

//     {
//         question: "When does registration close?",
//         answer: "Registration deadlines will be announced soon.",
//     },

//     {
//         question: "Will hardware be available?",
//         answer: "WEHack will be providing hardware, and we encourage you to use online hardware simulators.",
//     },

//     {
//         question: "What are the meal options offered?",
//         answer: "We will provide food for meat, vegetarian, gluten-free, and halal diets.",
        
//     },

//     {
//         question: "Can I sleep at WEHack?",
//         answer: "You are welcome to sleep at WEHack! Make sure to bring pillows, blankets, chargers, and other necessities if you are planning to stay the night.",        
//     }
// ]

export default FAQ