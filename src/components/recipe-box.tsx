import useGrimoire from '~/hooks/use-grimoire';
import { getBackgroundColorFromType } from '~/lib/utils';

export default function RecipeBox() {
  // const { queuedClips, playingClips, stoppingClips } = useContext(AbletonContext);
  // const { logger } = useContext(LoggerContext);
  // console.log('spell receipe', spellRecipe);
  const { spellRecipe, generateNewSpell, spellName } = useGrimoire();

  return (
    <div id='inner_recipe_box' className='max-w-full'>
      <div id='recipe-bg' className='h-[23vh] w-full max-h-full mx-auto bg-recipe-bg'>
        <div id='recipe-header' className='flex w-screen relative align-center justify-center'>
          <div id='title' className='font-fondamento stroke-black flex gap-2 mt-5 mb-2  text-2xl'>
            <div>Suggested Recipe:</div>
            <div>{spellName}</div>
          </div>
          <div id='new-spell' className='absolute right-0 z-10 bottom-0'>
            <button
              id='new-spell-btn'
              style={{ backgroundImage: `url(/images/new-spell.gif)` }}
              className='bg-cover h-[120px] w-[120px] py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-opacity-50'
              onClick={generateNewSpell}
            />
          </div>
        </div>
        <div id='ingredients_contianer' className='flex text-center align-top'>
          {Object.entries(spellRecipe).map(([type, recipe]) => {
            return recipe ? (
              <div className='relative' key={recipe.rfid}>
                <div
                  id={`ingredient-${recipe.ingredientName}-label`}
                  className='relative text-xl stroke-black font-fondamento min-h-[1rem]'
                >
                  {recipe.ingredientName}
                </div>
                <div
                  id={`ingredient-${recipe.rfid}-${type}`}
                  className='relative scale-[0.75] -top-[30px]'
                >
                  <div
                    id='color-blur'
                    className={`absolute inset-0 rounded-lg blur-xl z-0 ${getBackgroundColorFromType(
                      type,
                    )}`}
                  ></div>
                  <img
                    className='relative flex mt-3'
                    src={`/ingredients/${recipe?.assetName}`}
                    alt={recipe.ingredientName}
                  ></img>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
