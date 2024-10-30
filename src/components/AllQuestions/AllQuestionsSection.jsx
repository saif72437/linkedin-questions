import { useEffect, useState } from "react";
import { Client, Databases } from "appwrite"; // Import Appwrite SDK
import { questionmark } from "../../assets";
import Line from "../others/Line";
import Line2 from "../others/Line2";
import QuestionItem from "./QuestionItem";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

// Appwrite client setup
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Cloud endpoint
  .setProject("670f99ab001e200b8ee6"); // Replace with your actual project ID

const databases = new Databases(client);

function AllQuestionsSection() {
  const [questions, setQuestions] = useState([]); // All questions
  const [filteredQuestions, setFilteredQuestions] = useState([]); // Filtered questions
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Selected category
  const [categoryCounts, setCategoryCounts] = useState({}); // Category question counts

  // Fetch all questions from Appwrite on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await databases.listDocuments(
          "670f9c1d0010e00f0181", // Database ID
          "670f9c2f002ebe7198f7"  // Collection ID
        );
  
        const questionsList = response.documents.reverse(); // Reverse the order
        setQuestions(questionsList);
        setFilteredQuestions(questionsList); // Initialize with all questions
  
        // Count questions by category
        const counts = questionsList.reduce((acc, question) => {
          acc[question.category] = (acc[question.category] || 0) + 1;
          return acc;
        }, {});
        setCategoryCounts(counts);
      } catch (error) {
        toast.error("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, []);
  

  // Handle category change and filter questions
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "all") {
      setFilteredQuestions(questions); // Show all questions
    } else {
      const filtered = questions.filter((q) => q.category === category);
      setFilteredQuestions(filtered);
    }
  };

  if (loading) {
    return <div className="text-center text-2xl sm:text-4xl mt-10">Loading questions...</div>;
  }

  return (
    <div className="w-full">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Line />
      <div className="flex flex-col md:flex-row w-full gap-6 items-center text-center md:items-start md:text-left">
        <img className="w-[48px]" src={questionmark} alt="Question mark" />
        <h1 className="uppercase select-none text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] leading-tight font-semibold">
          All Question List
        </h1>
      </div>
      <Line2 />

      <div className="w-full mt-5  mb-10">
        <h2 className="text-3xl mb-5">Filter Questions By Category:</h2>
        <select
          className="py-2 px-3 text-xl md:text-2xl w-full border-2 rounded-md outline-none"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">
            All ({questions.length})
          </option>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <option key={category} value={category}>
              {category} ({count})
            </option>
          ))}
        </select>

      </div>
        <Line2 />

      <div className="container mx-auto px-4 py-10">
        <div className="flex w-full items-center justify-center flex-wrap gap-5">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <QuestionItem
                key={question.$id}
                category={question.category}
                question={question.question}
                linkedinUrl={question.linkedin}
                status={question.status}
                answerUrl={question["answer-url"]}
              />
            ))
          ) : (
            <p>No questions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllQuestionsSection;
